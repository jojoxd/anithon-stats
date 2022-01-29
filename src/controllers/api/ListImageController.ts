import {EntryService} from "../../services/EntryService";
import {Inject} from "@tsed/di";
import {Controller, Get, PathParams, UseCache} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import {ListImage} from "../../util/ListImage";
import {ChunkService} from "../../services/ChunkService";

@Controller("/:user/list/:list/image.png")
export class ListImageController
{
    @Inject()
    protected entryService: EntryService;

    @Inject()
    protected chunkService: ChunkService;

    @Get()
    @ContentType('image/png')
    @UseCache({ ttl: 300 })
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        const entries = await this.entryService.getEntries(user, listName);
        const chunks = await this.chunkService.chunkize(entries);

        const listImage = new ListImage(entries, chunks, listName);

        return listImage.generate();
    }
}