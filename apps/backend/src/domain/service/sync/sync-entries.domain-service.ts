import {ListEntity} from "../../entity/list/list.entity";
import {AnilistListView} from "../../view/anilist/list/anilist-list.view";
import {Inject, Service} from "@tsed/di";
import {SyncSeriesDomainService} from "./sync-series.domain-service";
import {InjectRepository} from "../../../ext/mikro-orm/inject-repository.decorator";
import {EntryDataEntity, EntryEntity, SeriesEntity} from "../../entity";
import {EntryDataRepository, EntryRepository, ListRepository, SeriesRepository} from "../../repository";
import {EntryEntityFactory} from "../../factory/entry/entry-entity.factory";

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

	async syncEntries(list: ListEntity, anilistListView: AnilistListView): Promise<void>
	{
		// anilistListView is the source of truth

		// Ensure we have all entry series in the database
		await this.syncSeriesService.syncSeries(anilistListView.entries);
		await list.entries.init({ populate: true });

		for(const anilistSeriesId of anilistListView.entries) {
			// try to find a local entry to update

			let entry = list.entries.getItems().find((entry) => entry.series.getEntity().anilistId === anilistSeriesId);
			let series = await this.seriesRepository.findOneOrFail({ anilistId: anilistSeriesId });

			if (!entry) {
				console.log('Creating entry');
				entry = EntryEntityFactory.create(list, series);
			} else {
				console.log('Found entry');
			}

			entry.series.set(series);

			// @TODO: Update entry.progress, entry.status

			await this.entryRepository.persist(entry);
		}

		// @TODO: Reverse match to remove old entries

		await this.listRepository.persistAndFlush(list);
	}
}
