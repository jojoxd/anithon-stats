import {ListEntity} from "../../entity/list/list.entity";
import {AnilistListView} from "../../view/anilist/list/anilist-list.view";
import {Inject, Service} from "@tsed/di";
import {SyncSeriesDomainService} from "./sync-series.domain-service";

@Service()
export class SyncEntriesDomainService
{
	@Inject()
	protected syncSeriesService!: SyncSeriesDomainService;

	async syncEntries(list: ListEntity, anilistListView: AnilistListView): Promise<void>
	{
		// anilistListView is the source of truth

		// Ensure we have all entry series in the database
		await this.syncSeriesService.syncSeries(anilistListView.entries);

		//throw new InternalServerError("AAAAAA");
	}
}
