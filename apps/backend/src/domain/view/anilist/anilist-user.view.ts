import {UserDataFragmentFragment} from "../../graphql/anilist/generated-types";

export class AnilistUserView
{
	constructor(
		protected user: UserDataFragmentFragment,
	) {}

	get userName(): string
	{
		return this.user!.name!;
	}

	get id(): any
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
