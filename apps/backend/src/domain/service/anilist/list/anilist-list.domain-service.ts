import {AnilistDomainService} from "../anilist.domain-service";
import {AnilistListView} from "../../../view/anilist/list/anilist-list.view";
import {MediaType} from "../../../graphql/anilist/generated-types";
import {Injectable, ProviderScope} from "@tsed/di";
import { $log } from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";
import {ListEntity} from "../../../entity/list/list.entity";
import {UserEntity} from "../../../entity/user/user.entity";

import {
	GetUserLists,
	GetUserListsQuery, GetUserListsQueryVariables,
} from "../../../graphql/anilist/list";
import {AnilistSeriesView} from "../../../view/anilist/series/anilist-series.view";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistListDomainService extends AnilistDomainService
{
	public async getLists(user: UserEntity): Promise<Array<AnilistListView>>
	{
		console.log('Get userlists of ', user.anilistId);
		const endHistogram = this.metrics.startHistogram('GetUserLists', 'QUERY');

		const { data, errors, error, } = await this.client.query<GetUserListsQuery, GetUserListsQueryVariables>({
			query: GetUserLists,

			variables: {
				userId: user.anilistId,
				mediaType: MediaType.Anime,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Getting lists of ${user.anilistId} failed`, { errors });
			throw new InternalServerError("Failed to fetch user lists", errors);
		}

		return data!.MediaListCollection!.lists!.map((list) => {
			const anilistSeriesViews = list!.entries!.map<AnilistSeriesView>(entry => new AnilistSeriesView(entry!.media!));

			return new AnilistListView(list!.name!, anilistSeriesViews);
		});
	}

	public async getList(list: ListEntity): Promise<AnilistListView | null>
	{
		// @TODO: Optimize, use new query

		await list.user.load();
		const lists = await this.getLists(list.user.getEntity());

		return lists.find(anilistListView => anilistListView.name === list.name) ?? null;
	}
}
