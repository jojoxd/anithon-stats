import {BodyParams, Controller, Get, PathParams, PlatformResponse, Post, QueryParams, Res, View} from "@tsed/common";
import {Inject} from "@tsed/di";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {SavedDataRepository} from "../../entity/SavedDataRepository";
import {ChunkService} from "../../services/ChunkService";
import {NotFound} from "@tsed/exceptions";

@Controller("/:user/list")
export class ListController {

    @Inject(AnilistService)
    protected anilist!: AnilistService;

    @Get("/:list")
    @View("list.pug")
    async getIndex(@PathParams("user") user: string, @PathParams("list") list: string, @QueryParams("debug") debug: boolean = false) {
        const _list = await this.anilist.getUserList(user, MediaType.ANIME, list);

        if(!_list) {
            throw new NotFound("List not found");
        }

        let savedData = await this.savedDataRepo.findOrCreate(list);

        const chunks = await this.chunkService.chunkize(_list, savedData);

        const lists = await this.anilist.getUserLists(user, MediaType.ANIME);
        const currentIndex = lists.findIndex((listName) => listName === list);
        const nextListIndex = (currentIndex + 1) % (lists.length + 1);
        const prevListIndex = (lists.length + currentIndex - 1) % (lists.length + 1);

        return {
            list: _list,
            savedData,
            chunks,
            user,
            debug,

            nextList: lists[nextListIndex] ?? null,
            prevList: lists[prevListIndex] ?? null,
        };
    }

    @Inject()
    savedDataRepo: SavedDataRepository;

    @Inject()
    chunkService: ChunkService;

    @Post("/:list/update")
    async postUpdateList(@PathParams("list") list: string, @BodyParams() body: UpdateData)
    {
        let savedData = await this.savedDataRepo.findOrCreate(list);

        for(const [id, opts] of Object.entries(body)) {
            savedData.data[id] = opts;

            if(typeof savedData.data[id].startAt !== "undefined")
                savedData.data[id].startAt = Number(savedData.data[id].startAt);

            if(typeof savedData.data[id].order !== "undefined")
                savedData.data[id].order = Number(savedData.data[id].order);
        }

        await this.savedDataRepo.save(savedData);

        return "OK";
    }
}

interface UpdateData
{
    [key: string]: {
        mult: number;
        order: number;
    };
}