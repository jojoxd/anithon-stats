import {ListEntity} from "../../entity/list/list.entity";
import {Inject, Service} from "@tsed/di";
import {SyncSeriesDomainService} from "./sync-series.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {EntryDataEntity} from "../../entity/entry/entry-data.entity";
import {EntryEntity} from "../../entity/entry/entry.entity";
import {SeriesEntity} from "../../entity/series/series.entity";
import { EntryDataRepository } from "../../repository/entry/entry-data.repository";
import { EntryRepository } from "../../repository/entry/entry.repository";
import { ListRepository } from "../../repository/list/list.repository";
import { SeriesRepository } from "../../repository/series/series.repository";
import {EntryEntityFactory} from "../../factory/entry/entry-entity.factory";
import {CountCall} from "@jojoxd/tsed-util/prometheus";
import {NotFound} from "@tsed/exceptions";
import {AnilistListDomainService} from "../anilist/list/anilist-list.domain-service";
import { MediaListGroupView } from "../../view/anilist/list/get-user-lists/media-list-group.view";

@Service()
export class SyncEntriesDomainService
{
	@Inject()
	protected syncSeriesService!: SyncSeriesDomainService;

	@Inject()
	protected anilistListService!: AnilistListDomainService;

	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@InjectRepository(ListEntity)
	protected listRepository!: ListRepository;

	@InjectRepository(EntryEntity)
	protected entryRepository!: EntryRepository;

	@InjectRepository(EntryDataEntity)
	protected entryDataRepository!: EntryDataRepository;

	@CountCall("sync_entries", "Times list entries have been synced")
	async syncEntries(list: ListEntity, mediaListGroupView: MediaListGroupView): Promise<void>
	{
		// anilistListView is the source of truth

		// Ensure we have all entry series in the database
		await this.syncSeriesService.syncList(mediaListGroupView);
		await list.entries.init({ populate: true });

		for(const mediaListGroupEntryView of mediaListGroupView.entries) {
			// try to find a local entry to update
			let entry = list.entries.getItems().find((entry) => entry.anilistId === mediaListGroupEntryView.id);
			const series = await this.syncSeriesService.findOrCreateSeriesEntity(mediaListGroupEntryView.media);

			if (!entry) {
				entry = EntryEntityFactory.create(list, series);
				entry.anilistId = mediaListGroupEntryView.id;
			}

			entry.series.set(series);

			entry.progress = mediaListGroupEntryView.progress;
			entry.state = mediaListGroupEntryView.entryState;

			await this.entryRepository.persist(entry);
		}

		// @TODO: Reverse match to remove old entries

		await this.listRepository.persistAndFlush(list);
	}

	public async syncToAnilist(list: ListEntity): Promise<void>
	{
		const mediaListGroupView = await this.anilistListService.getList(list);

		await list.entries.loadItems();
		await Promise.all(list.entries.getItems().map((listEntry) => {
			return listEntry.series.load();
		}));

		if (!mediaListGroupView) {
			throw new NotFound("Anilist List not found");
		}

		for(const entry of list.entries) {
			const mediaListGroupEntryView = mediaListGroupView.entries.find((mediaListGroupEntryView) => {
				return mediaListGroupEntryView.id === entry.anilistId;
			});

			if (!mediaListGroupEntryView) {
				// added from local
				await this.anilistListService.addToList(list, entry.series.getEntity().anilistId);
			}
		}

		for (const mediaListGroupEntryView of mediaListGroupView.entries) {
			const listEntry = list.entries.getItems().find((listEntry) => {
				return listEntry.anilistId === mediaListGroupEntryView.id;
			});

			if (!listEntry) {
				// no way to know if added from AniList, or removed from local.
				// local should have synced before page loading,
				// so we are expecting local to be correct here, remove it from AniList
				await this.anilistListService.removeFromList(list, mediaListGroupEntryView.media.id);
			}
		}
	}
}
