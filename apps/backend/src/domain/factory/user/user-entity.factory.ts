import {AnilistUserView} from "../../view/anilist/user/anilist-user.view";
import {UserEntity} from "../../entity/user/user.entity";

export class UserEntityFactory
{
	static createFromAnilistUser(anilistUserView: AnilistUserView): UserEntity
	{
		const user = new UserEntity();

		user.name = anilistUserView.userName;
		user.avatarUrl = anilistUserView.avatarUri;
		user.anilistId = anilistUserView.id;

		// user.lists = [];

		user.createdAt = new Date();

		return user;
	}
}
