import {Controller, Inject} from "@tsed/di";
import {BodyParams, Get, Put} from "@tsed/common";
import {ContentType, Header} from "@tsed/schema";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {IListMetadata} from "@anistats/shared/src/IListMetadata";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";

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
    // @TODO: Fix CustomAuth for PUT /api/:listId/settings
    @CustomAuth("pathParams.userName == currentUser.name")
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