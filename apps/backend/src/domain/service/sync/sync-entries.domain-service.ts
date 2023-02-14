import {ListEntity} from "../../entity/list/list.entity";
import {AnilistListView} from "../../view/anilist/list/anilist-list.view";
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
import {NotImplemented} from "@tsed/exceptions";

@Service()
export class SyncEntriesDomainService
{
	@Inject()
	protected syncSeriesService!: SyncSeriesDomainService;

	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@InjectRepository(ListEntity)
	protected listRepository!: ListRepository;

	@InjectRepository(EntryEntity)
	protected entryRepository!: EntryRepository;

	@InjectRepository(EntryDataEntity)
	protected entryDataRepository!: EntryDataRepository;

	@CountCall("sync_entries", "Times list entries have been synced")
	async syncEntries(list: ListEntity, anilistListView: AnilistListView): Promise<void>
	{
		// anilistListView is the source of truth

		// Ensure we have all entry series in the database
		await this.syncSeriesService.syncList(anilistListView);
		await list.entries.init({ populate: true });

		for(const anilistSeriesView of anilistListView.entries) {
			// try to find a local entry to update
			let entry = list.entries.getItems().find((entry) => entry.series.getEntity().anilistId === anilistSeriesView.id);
			let series = await this.syncSeriesService.findOrCreateSeriesEntity(anilistSeriesView.id, 10, undefined, anilistSeriesView);

			if (!entry) {
				entry = EntryEntityFactory.create(list, series);
			}

			entry.series.set(series);

			// @TODO: Update entry.progress, entry.status

			await this.entryRepository.persist(entry);
		}

		// @TODO: Reverse match to remove old entries

		await this.listRepository.persistAndFlush(list);
	}

	async syncToAnilist(list: ListEntity): Promise<void>
	{
		throw new NotImplemented("SYNCING UP TO ANILIST IS NOT IMPLEMENTED YET");
	}
}
