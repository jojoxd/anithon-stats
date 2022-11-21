import {Controller, Inject} from "@tsed/di";
import {BodyParams, Get, Put} from "@tsed/common";
import {ContentType, Header} from "@tsed/schema";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {IListMetadata} from "@anistats/shared/src/IListMetadata";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {UseAuth} from "@jojoxd/tsed-auth";
import {UserListMapperDecorator} from "../../services/mapper/UserListMapper";

@Controller("/list/:listId")
export class UserListSettingsController
{
    @Inject(USERLIST_REPOSITORY)
    protected userListRepository!: USERLIST_REPOSITORY;

    @Get("/settings")
    @Header({
        'Cache-Control': 'no-store'
    })
    @ContentType("application/json")
	@UserListMapperDecorator()
    async getMetadata(
        @PathParamEntity("listId") list: UserList
    ): Promise<IListMetadata>
    {
        return {
            allowChunkMerge: list.allowChunkMerge,
            maxChunkLength: list.maxChunkLength,
            maxChunkJoinLength: list.maxChunkJoinLength,
        };
    }

    // @TODO: Return Status or smth?
    @Put("/settings")
    @ContentType("application/json")
	@UserListMapperDecorator()
	@UseAuth("currentUser|exists && currentUser.lists[.id == pathParams.listId]|exists")
    async putMetadata(
        @PathParamEntity("listId") list: UserList,
        @BodyParams("data") data: IListMetadata
    ): Promise<any>
    {
        list.allowChunkMerge = data.allowChunkMerge ?? true;
        list.maxChunkLength = data.maxChunkLength;
        list.maxChunkJoinLength = data.maxChunkJoinLength;

        await this.userListRepository.save(list);
    }
}
