import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Header, Returns} from "@tsed/schema";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../../entity/UserList";
import {UserListContainerManager, Entry} from "../../../services";

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
		const listContainer = await this.userListContainerManager.createFromList(list);

		return listContainer.toEntries();
    }
}
