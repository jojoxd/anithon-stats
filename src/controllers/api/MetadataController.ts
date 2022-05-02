import {BodyParams, Controller, Get, Inject, PathParams, Post} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY, UserListRepository} from "../../entity/repository/UserListRepository";
import {ANILIST_USER_REPOSITORY} from "../../entity/repository/AnilistUserRepository";

@Controller("/:user/list/:list/metadata")
export class MetadataController
{
    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    @Inject(ANILIST_USER_REPOSITORY)
    protected readonly anilistUserRepository!: ANILIST_USER_REPOSITORY;

    @Get()
    public async get(
        @PathParams("user") userName: string,
        @PathParams("list") list: string
    ): Promise<IMetadata>
    {
        // @TODO: Fetch user using a manager?
        const user = await this.anilistUserRepository.findOne({ where: { userName: userName.toLowerCase() } });

        const userList = await this.userListRepository.findOrCreate(user!, list);

        return {
            allowChunkMerge: userList.allowChunkMerge,

            savedData: userList.savedData.data
        };
    }

    @Post()
    public async save(
        @PathParams("user") userName: string,
        @PathParams("list") list: string,
        @BodyParams("data") data: IMetadata
    ): Promise<IMetadata>
    {
        // @TODO: Fetch user using a manager?
        const user = await this.anilistUserRepository.findOne({ where: { userName: userName.toLowerCase() } });

        const userList = await this.userListRepository.findOrCreate(user!, list);

        if(data.savedData)
            userList.savedData.data = data.savedData;

        if(data.allowChunkMerge)
            userList.allowChunkMerge = data.allowChunkMerge;

        await this.userListRepository.save(userList);

        return this.get(userName, list);
    }
}