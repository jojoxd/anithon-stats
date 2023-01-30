import {SearchAnimeResponse} from "@anistats/shared";
import {Inject, Service} from "@tsed/di";
import {SearchSeriesDomainService} from "../../../domain/service/search/search-series.domain-service";
import {SeriesDomainService} from "../../../domain/service/series/series.domain-service";

@Service()
export class SearchAnimeApplicationService
{
	@Inject()
	protected searchSeriesService!: SearchSeriesDomainService;

	@Inject()
	protected seriesService!: SeriesDomainService;

	public async search(query: string): Promise<SearchAnimeResponse>
	{
		const series = await this.searchSeriesService.searchSeries(query);

		return {
			series: series.map(series => {
				return this.seriesService.mapToDto(series)
			}),
		};
	}
}
