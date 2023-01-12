import {SeriesEntity} from "../../entity/series/series.entity";
import {Inject, Service} from "@tsed/di";
import {AnilistSeriesDomainService, SyncSeriesDomainService} from "..";
import {InternalServerError} from "@tsed/exceptions";

@Service()
export class SearchSeriesDomainService
{
	@Inject()
	protected readonly anilistSeriesService!: AnilistSeriesDomainService;

	@Inject()
	protected readonly syncSeriesService!: SyncSeriesDomainService;

	async searchSeries(query: string): Promise<Array<SeriesEntity>> | never
	{
		const anilistSeriesViews = await this.anilistSeriesService.searchSeries(query);

		if (!anilistSeriesViews) {
			throw new InternalServerError("Could not get anilist series views");
		}

		return Promise.all(anilistSeriesViews.map((anilistSeriesView) => {
			return this.syncSeriesService.findOrCreateSeriesEntity(
				anilistSeriesView.id,
				undefined,
				undefined,
				anilistSeriesView
			);
		}));
	}
}
