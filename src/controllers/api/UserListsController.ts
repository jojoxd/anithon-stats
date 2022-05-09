import {Controller, Get, PathParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {ContentType, Header} from "@tsed/schema";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {IListData} from "@anistats/shared";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {AnilistUser} from "../../entity/AnilistUser";

@Controller('/user/:userName')
export class UserListsController
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Inject()
    protected anilistService!: AnilistService;

    @Inject(USERLIST_REPOSITORY)
    protected userListRepository!: USERLIST_REPOSITORY;

    @Get("/lists")
    @Header({
        'Cache-Control': 'no-store',
    })
    @ContentType("application/json")
    async getLists(@PathParamEntity("userName", { options: { type: "anilistUserId" } }) user: AnilistUser): Promise<IListData>
    {
        console.log("USER >>>>>>>>>>>>>>>>>>>>>>>>", user);

        const lists = await this.anilistService.getUserLists(user.anilistUserId, MediaType.ANIME);

        return lists.MediaListCollection?.lists?.reduce<IListData>((acc, list) => {
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

            acc[list.name!] = {
                totalDuration,
            };

            return acc;
        }, {}) ?? {};
    }

    @Get("/lists/:listName")
    @Header({
        'Cache-Control': 'no-store'
    })
    @ContentType("application/json")
    async getList(
        @PathParamEntity("user") user: AnilistUser,
        @PathParams("listName") listName: string
    ): Promise<IListData["value"]>
    {
        const lists = await this.getLists(user);

        return lists[listName]!;
    }
}
