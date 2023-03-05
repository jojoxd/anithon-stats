import {SeriesEntity} from "../../entity/series/series.entity";
import {Inject, Service} from "@tsed/di";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SyncSeriesDomainService} from "../sync/sync-series.domain-service";
import {InternalServerError} from "@tsed/exceptions";

@Service()
export class SearchSeriesDomainService
{
	@Inject()
	protected readonly anilistSeriesService!: AnilistSeriesDomainService;

	@Inject()
	protected readonly syncSeriesService!: SyncSeriesDomainService;

	public async searchSeries(query: string): Promise<Array<SeriesEntity>> | never
	{
		const mediaFragmentViews = await this.anilistSeriesService.searchSeries(query);

		if (!mediaFragmentViews) {
			throw new InternalServerError("Could not get anilist series views");
		}

		return Promise.all(mediaFragmentViews.map((mediaFragmentView) => {
			return this.syncSeriesService.findOrCreateSeriesEntity(mediaFragmentView);
		}));
	}
}
