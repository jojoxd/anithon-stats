import {Controller, Get, PathParams} from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";
import {Inject} from "@tsed/di";
import {Header, Returns} from "@tsed/schema";
import {Entry} from "../../services/ChunkService/Entry";
import {ListManager} from "../../services/ListManager";

@Controller("/entries/:user/:list")
export class EntryController
{
    @Inject()
    protected listManager!: ListManager;

    @Get()
    @Returns(200, Array).Of(Entry).Groups('deep-entry')
    @Header({
        'Cache-Control': 'no-store',
    })
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        try {
            const list = await this.listManager.getList(user.toLowerCase(), listName);

            return list.toEntries();
        } catch(e) {
            throw new InternalServerError("Something went wrong", e);
        }
    }
}