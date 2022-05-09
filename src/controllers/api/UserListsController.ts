import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {ContentType, Header} from "@tsed/schema";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {IListData} from "@anistats/shared";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";

@Controller('/user/:userName')
export class UserListsController
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Inject()
    protected anilistService!: AnilistService;

    @Get("/lists")
    @Header({
        'Cache-Control': 'no-store',
    })
    @ContentType("application/json")
    async getLists(@PathParams("userName") userName: string): Promise<IListData>
    {
        // @TODO: Use savedData if it exists?
        const lists = await this.anilistService.getUserLists(userName, MediaType.ANIME);

        const user = await this.anilistUserManager.getUserByName(userName, true);

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
        @PathParams("userName") userName: string,
        @PathParams("listName") listName: string
    ): Promise<IListData["value"]>
    {
        const lists = await this.getLists(userName);

        return lists[listName]!;
    }
}
