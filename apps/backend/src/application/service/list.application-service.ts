import {Inject, Service} from "@tsed/di";
import {ListId, ListResponse, UpdateListRequest} from "@anistats/shared";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {ListRepository} from "../../domain/repository/list/list.repository";
import {ListEntity} from "../../domain/entity/list/list.entity";
import {ListEntryDomainService} from "../../domain/service/list/list-entry.domain-service";
import {ListImageDomainService} from "../../domain/service/list/list-image.domain-service";
import {ListChunkDomainService} from "../../domain/service/list/list-chunk.domain-service";
import {ListSettingsDomainService} from "../../domain/service/list/list-settings.domain-service";
import {SeriesDomainService} from "../../domain/service/series/series.domain-service";
import {UserDomainService} from "../../domain/service/user/user.domain-service";
import {ListMetadataDomainService} from "../../domain/service/list/list-metadata.domain-service";
import {ListEntryDataDomainService} from "../../domain/service/list/list-entry-data.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {SyncDomainService} from "../../domain/service/sync/sync.domain-service";

@Service()
export class ListApplicationService
{
	@Inject()
	protected listImageService!: ListImageDomainService;

	@Inject()
	protected listEntryService!: ListEntryDomainService;

	@Inject()
	protected listChunkService!: ListChunkDomainService;

	@Inject()
	protected listSettingsService!: ListSettingsDomainService;

	@Inject()
	protected listMetadataService!: ListMetadataDomainService;

	@Inject()
	protected seriesService!: SeriesDomainService;

	@Inject()
	protected userService!: UserDomainService;

	@Inject()
	protected listEntryDataService!: ListEntryDataDomainService;

	@InjectRepository(ListEntity)
	protected listRepository!: ListRepository;

	@Inject()
	protected syncService!: SyncDomainService;

	public async getList(listId: ListId): Promise<ListResponse>
	{
		const list = await this.getListOrThrow(listId);

		// Sync list before fetching data
		await this.syncService.syncList(list);

		const [
			chunks,
			series,
			entries,
			user,
			metadata,
			settings,
		] = await Promise.all([
			this.listChunkService.getChunkList(list),
			this.seriesService.getSeriesList(list),
			this.listEntryService.getEntryList(list),
			this.userService.getUserFromList(list),
			this.listMetadataService.getMetadata(list),
			this.listSettingsService.getSettings(list),
		]);

		return {
			list: {
				id: list.id,

				chunks,
				entries,
				series,

				metadata,
				settings,
				user,
			},
		};
	}

	//@Transactional()
	public async updateList(updateListRequest: UpdateListRequest): Promise<void>
	{
		const list = await this.getListOrThrow(updateListRequest.id);

		for(const seriesId of updateListRequest.addSeries ?? []) {
			await this.listEntryService.addEntry(seriesId, list);
		}

		for(const seriesId of updateListRequest.removeSeries ?? []) {
			await this.listEntryService.removeEntry(seriesId, list);
		}

		await this.listSettingsService.updateListSettings(updateListRequest.settings, list);

		await this.listEntryDataService.updateEntryData(updateListRequest.data, list);
	}

	public async generateListImage(listId: ListId): Promise<Buffer>
	{
		const list = await this.getListOrThrow(listId);

		return this.listImageService.generateImage(list);
	}

	public async getListOrThrow(listId: ListId): Promise<ListEntity | never>
	{
		let list: ListEntity | null = null;

		try {
			list = await this.listRepository.findOne({ id: listId });
		} catch(e: any) {
			throw new InternalServerError("Could not fetch list", e);
		}

		if (!list) {
			throw new NotFound(`List ${listId} not found`);
		}

		return list;
	}
}
