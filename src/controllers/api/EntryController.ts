import {Controller, Get, PathParams} from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";
import {Inject} from "@tsed/di";
import {EntryService} from "../../services/EntryService";
import {Returns} from "@tsed/schema";
import {Entry} from "../../services/ChunkService/Entry";

@Controller("/:user/list/:list/entries")
export class EntryController
{
    @Inject()
    protected entryService: EntryService;

    @Get()
    @Returns(200, Array).Of(Entry).Groups('deep-entry')
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        try {
            return await this.entryService.getEntries(user, listName);
        } catch(e) {
            throw new InternalServerError("Something went wrong", "EntryController::getIndex()");
        }
    }
}