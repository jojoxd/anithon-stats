import {Controller, Get, PathParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {ChunkService} from "../../services/ChunkService";
import {EntryService} from "../../services/EntryService";
import {Returns} from "@tsed/schema";
import {ChunkList} from "../../dto/ChunkList";

@Controller("/:user/list/:list/chunks")
export class ChunkController
{
    @Inject()
    protected chunkService: ChunkService;

    @Inject()
    protected entryService: EntryService;

    @Get()
    @Returns(200, ChunkList).Groups()
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        try {
            const entries = await this.entryService.getEntries(user, listName);

            if(!entries)
                throw new NotFound("List Not Found");

            return this.chunkService.chunkize(entries);
        } catch(e) {
            if(e instanceof NotFound)
                throw e;

            throw new InternalServerError("Something went wrong", "ChunkController::getIndex()");
        }
    }
}