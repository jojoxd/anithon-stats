import {BodyParams, Controller, Get, Inject, PathParams, Post} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY, UserListRepository} from "../../entity/repository/UserListRepository";

@Controller("/:user/list/:list/metadata")
export class MetadataController
{
    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    @Get()
    public async get(
        @PathParams("user") user: string,
        @PathParams("list") list: string
    ): Promise<IMetadata>
    {
        const userList = await this.userListRepository.findOrCreate(user.toLowerCase(), list);

        return {
            allowChunkMerge: userList.allowChunkMerge,

            savedData: userList.savedData.data
        };
    }

    @Post()
    public async save(
        @PathParams("user") user: string,
        @PathParams("list") list: string,
        @BodyParams("data") data: IMetadata
    ): Promise<IMetadata>
    {
        const userList = await this.userListRepository.findOrCreate(user.toLowerCase(), list);

        if(data.savedData)
            userList.savedData.data = data.savedData;

        if(data.allowChunkMerge)
            userList.allowChunkMerge = data.allowChunkMerge;

        await this.userListRepository.save(userList);

        return this.get(user, list);
    }
}