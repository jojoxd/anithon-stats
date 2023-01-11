import {AnilistDomainService} from "../anilist.domain-service";
import {Injectable, ProviderScope} from "@tsed/di";
import {AnilistUserView} from "../../../view/anilist/anilist-user.view";
import {InternalServerError, NotFound, Unauthorized} from "@tsed/exceptions";

import {
	GetUser,
	GetUserQuery,
	GetUserQueryVariables
} from "../../../graphql/anilist/get-user.gql";

import {
	GetCurrentUser,
	GetCurrentUserQuery,
	GetCurrentUserQueryVariables
} from "../../../graphql/anilist/get-current-user.gql";
import {$log} from "@tsed/common";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistUserDomainService extends AnilistDomainService
{
	async getUser(userId: any): Promise<AnilistUserView>
	{
		const { data, errors } = await this.client.query<GetUserQuery, GetUserQueryVariables>({
			query: GetUser,
			variables: {
				userId,
			}
		});

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
		const { data, errors } = await this.client.query<GetCurrentUserQuery, GetCurrentUserQueryVariables>({
			query: GetCurrentUser,
		});

		if (errors) {
			$log.warn(`Failed to get current user`, { errors });
			throw new InternalServerError(`Failed to get current user`, errors);
		}

		if (!data.Viewer) {
			throw new Unauthorized("Not authenticated to anilist");
		}

		return new AnilistUserView(data.Viewer);
	}
}
