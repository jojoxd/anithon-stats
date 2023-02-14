import { AnilistDomainService } from "../anilist.domain-service";
import { Injectable, ProviderScope } from "@tsed/di";
import { AnilistUserView } from "../../../view/anilist/anilist-user.view";
import { InternalServerError, NotFound, Unauthorized } from "@tsed/exceptions";
import { $log } from "@tsed/common";
import { GetUser, GetUserQuery, GetUserQueryVariables } from "../../../graphql/anilist/user/get-user.gql";
import { GetCurrentUser, GetCurrentUserQuery, GetCurrentUserQueryVariables } from "../../../graphql/anilist/user/get-current-user.gql";
import { SearchUsers, SearchUsersQuery, SearchUsersQueryVariables } from "../../../graphql/anilist/user/search-users.gql";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistUserDomainService extends AnilistDomainService
{
	async getUser(userId: any): Promise<AnilistUserView>
	{
		const endHistogram = this.metrics.startHistogram("GetUser", "QUERY");

		const { data, errors, error, } = await this.client.query<GetUserQuery, GetUserQueryVariables>({
			query: GetUser,
			variables: {
				userId,
			}
		});

		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Failed to get anilist user ${userId}`, { errors });
			throw new InternalServerError(`Failed to get anilist user ${userId}`, errors);
		}

		if (!data.User) {
			throw new NotFound(`Could not find user on anilist: ${userId}`);
		}

		return new AnilistUserView(data.User);
	}

	async getCurrentUser(): Promise<AnilistUserView>
	{
		const endHistogram = this.metrics.startHistogram("GetCurrentUser", "QUERY");

		const { data, errors, error, } = await this.client.query<GetCurrentUserQuery, GetCurrentUserQueryVariables>({
			query: GetCurrentUser,

			// Important, might bleed session otherwise
			fetchPolicy: "no-cache",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Failed to get current user`, { errors });
			throw new InternalServerError(`Failed to get current user`, errors);
		}

		if (!data.Viewer) {
			throw new Unauthorized("Not authenticated to anilist");
		}

		return new AnilistUserView(data.Viewer);
	}

	async searchUsers(query: string, page: number = 1): Promise<Array<AnilistUserView> | null>
	{
		const endHistogram = this.metrics.startHistogram("SearchUsers", "QUERY");

		const { data, errors, error, } = await this.client.query<SearchUsersQuery, SearchUsersQueryVariables>({
			query: SearchUsers,

			variables: {
				query,
				page,
				perPage: 10,
			},

			fetchPolicy: "cache-first",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Failed to get current user`, { errors });
			throw new InternalServerError(`Failed to get current user`, errors);
		}

		return data.Page?.users?.map((user) => {
			return new AnilistUserView(user!);
		}) ?? null;
	}
}
