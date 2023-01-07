import {SearchAnimeResponse, SeriesDto} from "@anistats/shared";
import {Service} from "@tsed/di";
import {AnilistSearchService, MediaType, searchSeries_Page_media} from "@anistats/anilist";
import {NotImplemented} from "@tsed/exceptions";

@Service()
export class SearchAnimeApplicationService
{
	protected anilistSearchService!: AnilistSearchService;

	public async search(query: string): Promise<SearchAnimeResponse>
	{
		const series = await this.anilistSearchService.searchSeriesByName(query, MediaType.ANIME);

		throw new NotImplemented("TODO: update anilistSearchService to give ID's only, use database and auto-fill from anilist where needed");
	}
}
