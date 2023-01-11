import {AnilistDomainService} from "../anilist.domain-service";
import {UserEntity} from "../../../entity/user/user.entity";
import {GetUserLists, GetUserListsQuery, GetUserListsQueryVariables} from "../../../graphql/anilist/list/get-user-lists.gql";
import {AnilistListView} from "../../../view/anilist/list/anilist-list.view";
import {MediaType} from "../../../graphql/anilist/generated-types";
import {Injectable, ProviderScope} from "@tsed/di";
import { $log } from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistListDomainService extends AnilistDomainService
{
	public async getLists(user: UserEntity): Promise<Array<AnilistListView>>
	{
		console.log('Get userlists of ', user.anilistId);

		const { data, errors } = await this.client.query<GetUserListsQuery, GetUserListsQueryVariables>({
			query: GetUserLists,

			variables: {
				userId: user.anilistId,
				mediaType: MediaType.Anime,
			},

			errorPolicy: "ignore"
		});

		if (errors) {
			$log.warn(`Getting lists of ${user.anilistId} failed`, { errors });
			throw new InternalServerError("Failed to fetch user lists", errors);
		}

		return data!.MediaListCollection!.lists!.map((list) => {
			const mediaIds = list!.entries!.map(entry => entry!.mediaId!);

			return new AnilistListView(list!.name!, mediaIds);
		});
	}
}
