import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Header, Returns} from "@tsed/schema";
import {ChunkList} from "../../../dto/ChunkList";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../../entity/UserList";
import {UserListContainerManager} from "../../../services/UserListContainerManager";

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
		const listContainer = await this.userListContainerManager.createFromList(list);

		return listContainer.toChunkList();
    }
}
