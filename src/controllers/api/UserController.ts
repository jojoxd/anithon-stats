import {$log, Controller, Inject, PathParams, ProviderScope, Scope, Session} from "@tsed/common";
import {UseCache} from "@tsed/platform-cache";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {ContentType, Get, Header} from "@tsed/schema";
import {ICurrentUser, IListData} from "@anistats/shared";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {BodyParamEntity, PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {AnilistUser} from "../../entity/AnilistUser";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
export class UserControllerOld
{
    @Inject()
    protected anilistService!: AnilistService;

    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Get("/@current")
    @ContentType("application/json")
    async getCurrentUser(@Session() session: any): Promise<ICurrentUser>
    {
        const currentUser = await this.anilistService.getCurrentUser();

        if(!currentUser) {
            return { isAuthenticated: false };
        }

        return { ...currentUser, isAuthenticated: true, isCurrentUser: true };
    }

    // @Get("/:userName")
    // @ContentType("application/json")
    // async getFindUser(@PathParams("userName") userName: string)
    // {
    //     $log.info(`Find User: ${userName}`);
    //
    //     const currentUser = await this.anilistService.getCurrentUser();
    //
    //     const user = await this.anilistService.searchUserByName(userName);
    //
    //     if(!user)
    //         return null;
    //
    //     this.anilistUserManager.getUserByAnilistId(user.id);
    //
    //     return {
    //         ...user,
    //         isCurrentUser: user.id === currentUser?.id,
    //     };
    // }

    @Get("/:userName/lists")
    @Header({
        'Cache-Control': 'no-store',
    })
    @ContentType("application/json")
    @UseCache({ ttl: 60 })
    async getLists(@PathParamEntity("userName", { options: { type: "anilistUserId" } }) user: AnilistUser): Promise<IListData>
    {
        console.log("USER >>>>>>>>>>>>>>>>>>>>>>>>", user);

        const lists = await this.anilistService.getUserLists(user.anilistUserId, MediaType.ANIME);

        const listData: Partial<IListData> = {};

        listData.lists = lists.MediaListCollection?.lists?.reduce<IListData["lists"]>((acc, list) => {
            if(list === null) return acc;

            const savedData = user?.lists?.find(_list => _list.listName === list.name)?.savedData;

            const totalDuration = list?.entries?.reduce((acc, entry) => {
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

            if(!userList)
                throw new Error("Error: Could not match UserList to AniList Response");

            acc.push({
                id: userList.id,

                name: list.name!,

                meta: {
                    totalDuration,
                },
            });

            return acc;
        }, []) ?? [];

        return listData as IListData;
    }

    @Get("/:userName/lists/:listName")
    @Header({
        'Cache-Control': 'no-store'
    })
    @ContentType("application/json")
    async getList(
        @PathParamEntity("user") user: AnilistUser,
        @PathParams("listName") listName: string
    ): Promise<IListData["lists"][0] | null>
    {
        const listsData = await this.getLists(user);

        return listsData.lists.find(list => list.name === listName) ?? null;
    }
}
