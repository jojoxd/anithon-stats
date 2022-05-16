import {$log, BodyParams, Controller, Get, Inject, Put} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UseAuth} from "@jojoxd/tsed-auth";

@Controller("/list/:listId")
export class SavedDataController
{
    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    @Get("/savedData")
    public async get(
        @PathParamEntity("listId") list: UserList,
    ): Promise<IMetadata>
    {
        return {
            allowChunkMerge: list.allowChunkMerge,

            savedData: list.savedData.data
        };
    }

    @Put("/savedData")
	@UseAuth("currentUser|exists && currentUser.lists[.id == pathParams.listId]|exists")
    public async save(
        @PathParamEntity("listId") list: UserList,
        @BodyParams("data") data: IMetadata
    ): Promise<IMetadata>
    {
		$log.info("List BEFORE UPDATE", list);

        if(data.savedData)
            list.savedData.data = data.savedData;

        if(data.allowChunkMerge)
            list.allowChunkMerge = data.allowChunkMerge;

        $log.info("List BEFORE SAVE", list);

        list = await this.userListRepository.save(list);

		$log.info("List AFTER SAVE", list);

        return this.get(list);
    }
}
