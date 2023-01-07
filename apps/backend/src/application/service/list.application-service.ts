import {Inject, Service} from "@tsed/di";
import {ListId, ListResponse, UpdateListRequest} from "@anistats/shared";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {ListRepository} from "../../domain/repository/list/list.repository";
import {ListEntity} from "../../domain/entity/list/list.entity";
import {ListEntryDomainService} from "../../domain/service/list-entry.domain-service";
import {ListImageDomainService} from "../../domain/service/list-image.domain-service";
import {ListChunkDomainService} from "../../domain/service/list-chunk.domain-service";
import {ListSettingsDomainService} from "../../domain/service/list-settings.domain-service";
import {UseTransaction} from "../../datasources/use-transaction.decorator";
import {SqliteDataSource} from "../../datasources/sqlite.data-source";
import {SeriesDomainService} from "../../domain/service/series.domain-service";
import {UserDomainService} from "../../domain/service/user.domain-service";
import {ListMetadataDomainService} from "../../domain/service/list-metadata.domain-service";
import {ListEntryDataDomainService} from "../../domain/service/list-entry-data.domain-service";

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

	@Inject(ListRepository)
	protected listRepository!: ListRepository;

	public async getList(listId: ListId): Promise<ListResponse>
	{
		const list = await this.getListOrThrow(listId);

		const chunks = await this.listChunkService.getChunkList(list);
		const series = await this.seriesService.getSeriesList(list);
		const entries = await this.listEntryService.getEntryList(list);
		const user = await this.userService.getUserFromList(list);
		const metadata = await this.listMetadataService.getMetadata(list);
		const settings = await this.listSettingsService.getSettings(list);

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

	@UseTransaction(SqliteDataSource)
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
			list = await this.listRepository.findOneBy({ id: listId });
		} catch(e: any) {
			throw new InternalServerError("Could not fetch list", e);
		}

		if (!list) {
			throw new NotFound(`List ${listId} not found`);
		}

		return list;
	}
}
