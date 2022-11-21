import {$log, Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {InternalServerError, NotFound} from "@tsed/exceptions";
import {ContentType, Header, Returns} from "@tsed/schema";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UserListContainerManager} from "../../services/UserListContainerManager";
import {UserListMapperDecorator} from "../../services/mapper/UserListMapper";
import {ChunkDTO, ListDTO} from "@anistats/shared-dto";

@Controller("/list/:listId")
export class ChunkController
{
    @Inject()
    protected userListContainerManager!: UserListContainerManager;

    @Get("/chunks")
    @Returns(200, ListDTO).Of(ChunkDTO).Groups()
    @Header({
        'Cache-Control': 'no-store',
    })
	@ContentType("application/json")
	@UserListMapperDecorator()
    public async getIndex(
        @PathParamEntity("listId") list: UserList
    ): Promise<ListDTO<ChunkDTO>> {
        $log.info(">>>>>>>>>>>>>>>>>>> LIST", list);

        // @TODO: Cleanup
        try {
            const listContainer = await this.userListContainerManager.createFromList(list);

			const chunkList = await listContainer.toChunkList();

            return new ListDTO<ChunkDTO>({
				items: chunkList.chunks.map(chunk => new ChunkDTO(chunk))
			});
        } catch(e) {
            if(e instanceof NotFound)
                throw e;

            $log.error(e);

            throw new InternalServerError("Something went wrong", e);
        }
    }
}
