import {UserViewFragment} from "../../../graphql/anilist/generated-types";
import {AnilistUserId} from "@anistats/shared";

/**
 * @TODO: Rename to UserFragmentView
 */
export class AnilistUserView
{
	constructor(
		protected user: UserViewFragment,
	) {}

	get userName(): string
	{
		return this.user!.name!;
	}

	get id(): AnilistUserId
	{
		return this.user!.id!;
	}

	get avatarUri(): string
	{
		return this.user!.avatar!.large ?? this.user!.avatar!.medium!;
	}

	get bannerUri(): string | null
	{
		return this.user!.bannerImage ?? null;
	}
}
