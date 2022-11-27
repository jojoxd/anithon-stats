import {Controller, Inject} from "@tsed/di";
import {ISearchItemList, ISearchItemUser, ISearchRequest, ISearchResponse} from "@anistats/shared";
import {BodyParams, Post} from "@tsed/common";
import {AnilistService} from "@anime-rss-filter/anilist";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {UserList} from "../../entity/UserList";

@Controller("/search")
export class SearchController
{
	@Inject()
	protected anilistService!: AnilistService;

	@Inject(USERLIST_REPOSITORY)
	protected listRepository!: USERLIST_REPOSITORY;

	@Post("/")
	async search(@BodyParams() searchRequest: ISearchRequest): Promise<ISearchResponse>
	{
		const users = await this.anilistService.findUsersByName(searchRequest.query);
		const currentUser = await this.anilistService.getCurrentUser();
		let lists: Array<UserList> = [];

		if (currentUser) {
			lists = await this.listRepository.search(currentUser.id, searchRequest.query);
		}

		return {
			items: [
				...users.map<ISearchItemUser>((user) => {
					return {
						type: 'user',
						name: user.name,

						uuid: 'test',
					};
				}),

				...lists.map<ISearchItemList>((list) => {
					return {
						type: 'list',
						name: list.listName,

						uuid: list.id,
					};
				}),
			],
		};
	}
}
