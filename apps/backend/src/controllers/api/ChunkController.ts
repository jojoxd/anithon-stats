import {$log, Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {Header, Returns} from "@tsed/schema";
import {ChunkList} from "../../dto/ChunkList";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UserListContainerManager} from "../../services/UserListContainerManager";

@Controller("/list/:listId")
export class ChunkController
{
    @Inject()
    protected userListContainerManager!: UserListContainerManager;

    @Get("/chunks")
    @Returns(200, ChunkList).Groups()
    @Header({
        'Cache-Control': 'no-store',
    })
    public async getIndex(
        @PathParamEntity("listId") list: UserList
    ): Promise<ChunkList> {
        $log.info(">>>>>>>>>>>>>>>>>>> LIST", list);

        // @TODO: Cleanup
        try {
            const listContainer = await this.userListContainerManager.createFromList(list);

            return listContainer.toChunkList();
        } catch(e) {
            if(e instanceof NotFound)
                throw e;

            $log.error(e);

            throw new InternalServerError("Something went wrong", e);
        }
    }
}
