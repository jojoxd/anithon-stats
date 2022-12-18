import {Controller, Inject} from "@tsed/di";
import {BodyParamEntity} from "@jojoxd/tsed-entity-mapper";
import {AnilistUser} from "../../../entity/AnilistUser";
import {ContentType, Header, Post} from "@tsed/schema";
import {AnilistUserManager} from "../../../services/AnilistUserManager";
import {PathParams} from "@tsed/common";
import {IListData, IUserData} from "@anistats/shared";
import {AnilistService, MediaType} from "@anistats/anilist";

@Controller("/user")
export class UserListController
{
    @Inject()
    protected readonly anilistUserManager!: AnilistUserManager;

    @Inject()
	protected readonly anilistService!: AnilistService;

    @Post("/get")
    async getUser(@BodyParamEntity() user: AnilistUser): Promise<IUserData | null>
    {
        return this.anilistUserManager.toUserData(user);
    }

	@Post("/lists")
	@Header({
		'Cache-Control': 'no-store'
	})
	@ContentType("application/json")
	async getLists(@BodyParamEntity() user: AnilistUser): Promise<IListData>
	{
		const currentLists = await this.anilistService.getUserLists(user.anilistUserId, MediaType.ANIME);

		const userData = await this.getUser(user);

		if(!userData)
			throw new Error("TODO: Better Error Handling");

		const listsData: IListData["lists"] = currentLists.MediaListCollection?.lists?.reduce<IListData["lists"]>((acc, list) => {
			if(list === null)
				return acc;

			const savedData = user?.lists?.find(_list => _list.listName === list.name)?.savedData;

			const totalDuration = list?.entries?.reduce<number>((acc, entry) => {
				let entryDuration = (entry!.media!.duration ?? 0) * (entry!.media!.episodes ?? 0);

				if(savedData) {
					const mult = savedData.data[entry!.id]?.mult;
					const startAt = savedData.data[entry!.id]?.startAt;

					entryDuration = (entry!.media!.duration! - (startAt ?? 0)) * (entry!.media!.episodes ?? 0) * (mult ?? 1);
				}

				acc += entryDuration;

				return acc;
			}, 0) ?? 0;

			const userList = user.lists?.find(userList => userList.listName === list.name!);

			if(!userList) {
				throw new Error("Error: Could not match UserList to AniList Response");
			}

			acc.push({
				id: userList.id,

				name: list.name!,

				meta: {
					totalDuration,
				},
			});

			return acc;
		}, []) ?? [];

		return {
			user: userData,

			lists: listsData.sort((a, b) => {
				return a.name.localeCompare(b.name, undefined, { numeric: true });
			}),
		};
	}

	@Post("/list/:listId")
	@Header({
		'Cache-Control': 'no-store'
	})
	@ContentType("application/json")
	async getList(
		@BodyParamEntity() user: AnilistUser,
		@PathParams("listId") listId: string
	): Promise<IListData["lists"][0] | null>
	{
		const listsData = await this.getLists(user);

		return listsData.lists.find(list => list.id === listId) ?? null;
	}
}
