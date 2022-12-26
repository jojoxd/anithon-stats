import {BodyParams, Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Delete, Header, Put, Returns} from "@tsed/schema";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../../entity/UserList";
import {UserListContainerManager, Entry} from "../../../services";
import {ListAddEntryRequest, ListRemoveEntryRequest} from "@anistats/shared";
import { UseAuthExpression } from "@jojoxd/tsed-auth-expression";
import {InternalServerError} from "@tsed/exceptions";
import { UserListManager } from "../../../services/UserListManager";

@Controller("/list/:listId")
export class EntryController
{
    @Inject()
    protected userListContainerManager!: UserListContainerManager;

    @Inject()
	protected userListManager!: UserListManager;

    @Get("/entries")
    @Returns(200, Array).Of(Entry).Groups('deep-entry')
    @Header({
        'Cache-Control': 'no-store',
    })
    public async getEntries(
        @PathParamEntity("listId") list: UserList,
    ) {
		const listContainer = await this.userListContainerManager.createFromList(list);

		return listContainer.toEntries();
    }

	@Put("/entries/add")
	@UseAuthExpression("currentUser|exists && currentUser.lists[.id == pathParams.listId]|exists")
	async addEntryToList(
		@PathParamEntity('listId') list: UserList,
		@BodyParams() addRequest: ListAddEntryRequest
	) {
		return this.userListManager.addEntry(list, addRequest);
	}

	@Delete("/entries/remove")
	@UseAuthExpression("currentUser|exists && currentUser.lists[.id == pathParams.listId]|exists")
	async removeEntryFromList(
		@PathParamEntity('listId') list: UserList,
		@BodyParams() removeRequest: ListRemoveEntryRequest
	) {
		return this.userListManager.removeEntry(list, removeRequest);
	}
}
