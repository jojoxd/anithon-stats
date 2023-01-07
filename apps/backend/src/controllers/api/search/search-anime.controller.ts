import {Controller, Inject} from "@tsed/di";
import {Post} from "@tsed/schema";
import {BodyParams} from "@tsed/common";
import {SearchAnimeRequest, SearchAnimeResponse} from "@anistats/shared";
import {SearchAnimeApplicationService} from "../../../application/service/search/search-anime.application-service";

@Controller("/search/anime")
export class SearchAnimeController
{
	@Inject()
	protected readonly searchAnimeService!: SearchAnimeApplicationService;

	@Post("/")
	async searchAnime(@BodyParams() searchAnimeRequest: SearchAnimeRequest): Promise<SearchAnimeResponse>
	{
		return this.searchAnimeService.search(searchAnimeRequest.query);
	}
}
