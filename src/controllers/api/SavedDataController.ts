import {$log, BodyParams, Controller, Get, Inject, Put} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UseAuth} from "@jojoxd/tsed-auth";
import {UserListMapperDecorator} from "../../services/mapper/UserListMapper";
import {Returns} from "@tsed/schema";
import {Type} from "@tsed/core";
import {MetadataImpl} from "../../dto/SavedDataController/MetadataImpl";
import {InternalServerError} from "@tsed/exceptions";

@Controller("/list/:listId")
export class SavedDataController
{
    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    @Get("/savedData")
	@UserListMapperDecorator()
	@Returns(200, MetadataImpl).Description("Saved Data of list")
    public async get(
        @PathParamEntity("listId") list: UserList,
    ): Promise<MetadataImpl>
    {
        return {
            allowChunkMerge: list.allowChunkMerge,

            savedData: list.savedData.data
        };
    }

    @Put("/savedData")
	@UserListMapperDecorator()
	@Returns(200, MetadataImpl).Description("The new Metadata")
	@Returns(500, InternalServerError).Description("Something went wrong")
	@UseAuth("currentUser|exists && currentUser.lists[.id == pathParams.listId]|exists")
    public async save(
        @PathParamEntity("listId") list: UserList,
        @BodyParams("data") data: MetadataImpl
    ): Promise<MetadataImpl>
    {
    	try {
			if (data.savedData)
				list.savedData.data = data.savedData;

			if (data.allowChunkMerge)
				list.allowChunkMerge = data.allowChunkMerge;

			list = await this.userListRepository.save(list);
		} catch(e) {
    		throw new InternalServerError("Something went wrong saving metadata");
		}

        return this.get(list);
    }
}
