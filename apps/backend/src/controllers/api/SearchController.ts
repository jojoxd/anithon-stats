import {Controller, Inject} from "@tsed/di";
import {
	SearchItemListDto,
	SearchItemUserDto,
	SearchRequest,
	SearchResponse,
	SearchAnimeRequest,
	SearchAnimeResponse
} from "@anistats/shared";
import {BodyParams, Post} from "@tsed/common";
import {AnilistSearchService, AnilistService, MediaType} from "@anistats/anilist";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {UserList} from "../../entity/UserList";

@Controller("/search")
export class SearchController
{
	@Inject()
	protected anilistService!: AnilistService;

	@Inject()
	protected anilistSearchService!: AnilistSearchService;

	@Inject(USERLIST_REPOSITORY)
	protected listRepository!: USERLIST_REPOSITORY;

	@Post("/")
	async search(@BodyParams() searchRequest: SearchRequest): Promise<SearchResponse>
	{
		const users = await this.anilistService.findUsersByName(searchRequest.query);
		const currentUser = await this.anilistService.getCurrentUser();
		let lists: Array<UserList> = [];

		if (currentUser) {
			lists = await this.listRepository.search(currentUser.id, searchRequest.query);
		}

		return {
			users: users.map<SearchItemUserDto>((user) => {
				return {
					name: user.name,
					avatar: user.avatar.large ?? undefined,
				};
			}),

			lists: lists.map<SearchItemListDto>((list) => {
				return {
					name: list.listName,
					uuid: list.id,
				};
			}),
		};
	}

	@Post('/series')
	async searchAnime(@BodyParams() request: SearchAnimeRequest): Promise<SearchAnimeResponse>
	{
		const data = await this.anilistSearchService.searchSeriesByName(request.query, MediaType.ANIME);

		return {
			series: data.map((serie) => {
				return {
					id: serie.id,

					title: {
						english: serie.title!.english!,
						native: serie.title!.native!,
						romaji: serie.title!.romaji!,
					},

					description: serie.description,
					coverImage: serie.coverImage!.large!,
					duration: serie.duration!,
					episodes: serie.episodes,
					notes: null,
				}
			}),
		};
	}
}
