import {Inject, Service} from "@tsed/di";
import {ListId, ListResponse, UpdateListRequest} from "@anistats/shared";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {ListRepository} from "../../domain/repository/list/list.repository";
import {ListEntity} from "../../domain/entity/list/list.entity";
import {EntryDomainService} from "../../domain/service/entry/entry.domain-service";
import {ListImageDomainService} from "../../domain/service/list/image/list-image.domain-service";
import {ListChunkDomainService} from "../../domain/service/list/chunk/list-chunk.domain-service";
import {ListSettingsDomainService} from "../../domain/service/list/settings/list-settings.domain-service";
import {SeriesDomainService} from "../../domain/service/series/series.domain-service";
import {UserDomainService} from "../../domain/service/user/user.domain-service";
import {ListMetadataDomainService} from "../../domain/service/list/metadata/list-metadata.domain-service";
import {EntryDataDomainService} from "../../domain/service/entry/entry-data.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {SyncDomainService} from "../../domain/service/sync/sync.domain-service";
import { Transactional } from "@tsed/mikro-orm";
import { $log } from "@tsed/common";
import { SyncEntriesDomainService } from "../../domain/service/sync/sync-entries.domain-service";

@Service()
export class ListApplicationService
{
	@Inject()
	protected listImageService!: ListImageDomainService;

	@Inject()
	protected listEntryService!: EntryDomainService;

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
	protected listEntryDataService!: EntryDataDomainService;

	@InjectRepository(ListEntity)
	protected listRepository!: ListRepository;

	@Inject()
	protected syncService!: SyncDomainService;

	@Inject()
	protected syncEntriesService!: SyncEntriesDomainService;

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

	@Transactional()
	public async updateList(updateListRequest: UpdateListRequest): Promise<void>
	{
		const list = await this.getListOrThrow(updateListRequest.id);
		await list.entries.loadItems();

		for(const entryDto of updateListRequest.entries) {
			let entryEntity = list.entries.getItems().find((entryEntity) => entryEntity.id === entryDto.id);

			if (!entryEntity) {
				entryEntity = await this.listEntryService.createFromDto(entryDto);

				list.entries.add(entryEntity);

				$log.info('New entry from frontend', entryEntity.id);

				// Overwrite ID's in updateListRequest to newly generated ID's
				// Will save entryData with updateEntryData below
				const entryData = updateListRequest.data.find(entryData => entryData.ref === entryDto.id);

				entryDto.id = entryEntity.id;
				if (entryData) {
					entryData.ref = entryEntity.id;
				}
			}

			// @NOTE: May fail if customSequel is new?
			if(entryDto.customSequel) {
				const customSequelEntity = list.entries.getItems().find((_entry) => {
					return _entry.id === entryDto.customSequel!.ref;
				});

				entryEntity.customSequel = customSequelEntity;
			}
		}

		// @TODO: Remove old entries
		for(const entryEntity of list.entries.getItems()) {
			const entryDto = updateListRequest.entries.find((entryDto) => {
				return entryDto.id === entryEntity.id;
			});

			// Removed
			if (!entryDto) {
				$log.info('List Entry Removed', entryEntity.id);
				list.entries.remove(entryEntity);
			}
		}

		await this.listRepository.persistAndFlush(list);

		await this.syncEntriesService.syncToAnilist(list);

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
