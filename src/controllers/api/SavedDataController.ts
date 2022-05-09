import {BodyParams, Controller, Get, Inject, Put} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";

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
    // @TODO: Check CustomAuth access to compiled arguments
    // @CustomAuth("pathParams.user == currentUser.name")
    public async save(
        @PathParamEntity("listId") list: UserList,
        @BodyParams("data") data: IMetadata
    ): Promise<IMetadata>
    {
        if(data.savedData)
            list.savedData.data = data.savedData;

        if(data.allowChunkMerge)
            list.allowChunkMerge = data.allowChunkMerge;

        await this.userListRepository.save(list);

        return this.get(list);
    }
}
