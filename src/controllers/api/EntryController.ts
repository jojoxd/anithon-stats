import {Controller, Get} from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";
import {Inject} from "@tsed/di";
import {Header, Returns} from "@tsed/schema";
import {Entry} from "../../services/ChunkService/Entry";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UserListContainerManager} from "../../services/UserListContainerManager";

@Controller("/list/:listId")
export class EntryController
{
    @Inject()
    protected userListContainerManager!: UserListContainerManager;

    @Get("/entries")
    @Returns(200, Array).Of(Entry).Groups('deep-entry')
    @Header({
        'Cache-Control': 'no-store',
    })
    public async getIndex(
        @PathParamEntity("listId") list: UserList,
    ) {
        // @TODO: Cleanup
        try {
            const listContainer = await this.userListContainerManager.createFromList(list);

            return listContainer.toEntries();
        } catch(e) {
            throw new InternalServerError("Something went wrong", e);
        }
    }
}