import {$log, Controller, Get, PathParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {Header, Returns} from "@tsed/schema";
import {ChunkList} from "../../dto/ChunkList";
import {ListManager} from "../../services/ListManager";

@Controller("/:user/list/:list/chunks")
export class ChunkController
{
    @Inject()
    protected listManager: ListManager;

    @Get()
    @Returns(200, ChunkList).Groups()
    @Header({
        'Cache-Control': 'no-store',
    })
    public async getIndex(
        @PathParams("user") user: string,
        @PathParams("list") listName: string
    ) {
        try {
            const list = await this.listManager.getList(user.toLowerCase(), listName);

            return list.toChunkList();
        } catch(e) {
            if(e instanceof NotFound)
                throw e;

            $log.error(e);

            throw new InternalServerError("Something went wrong", e);
        }
    }
}
