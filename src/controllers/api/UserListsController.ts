import {BodyParams, Controller, Get, PathParams, Put, QueryParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {ContentType, Header} from "@tsed/schema";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {IListData} from "@anistats/shared";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {IListMetadata} from "../../../packages/shared/src/IListMetadata";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";

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
    async getLists(@PathParams("userName") userName: string): Promise<IListData>
    {
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

    @Get("/lists/:listName/metadata")
    @Header({
        'Cache-Control': 'no-store'
    })
    @ContentType("application/json")
    async getMetadata(
        @PathParams("userName") userName: string,
        @PathParams("listName") listName: string
    ): Promise<IListMetadata>
    {
        const user = await this.anilistUserManager.getUserByName(userName);

        if(!user)
            throw new Error("User not found");

        const list = user.lists?.find(list => list.listName === listName);

        if(!list)
            throw new Error("User has no such list");

        return {
            allowChunkMerge: list.allowChunkMerge,
            maxChunkLength: list.maxChunkLength,
            maxChunkJoinLength: list.maxChunkJoinLength,
        };
    }

    @Put("/lists/:listName/metadata")
    @ContentType("application/json")
    @CustomAuth("pathParams.userName == currentUser.name")
    async putMetadata(
        @PathParams("userName") userName: string,
        @PathParams("listName") listName: string,
        @BodyParams("data") data: IListMetadata
    ): Promise<any>
    {
        const user = await this.anilistUserManager.getUserByName(userName);

        if(!user)
            throw new Error("User not found");

        const list = user.lists?.find(list => list.listName === listName);

        if(!list)
            throw new Error("User has no such list");

        list.allowChunkMerge = data.allowChunkMerge ?? true;
        list.maxChunkLength = data.maxChunkLength;
        list.maxChunkJoinLength = data.maxChunkJoinLength;

        await this.userListRepository.save(list);
    }
}
