import {BodyParams, Controller, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {IMetadata} from "@anistats/shared";
import {USERLIST_REPOSITORY, UserListRepository} from "../../entity/repository/UserListRepository";
import {ANILIST_USER_REPOSITORY} from "../../entity/repository/AnilistUserRepository";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {AnilistUserManager} from "../../services/AnilistUserManager";

@Controller("/metadata")
export class MetadataController
{
    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    @Inject(ANILIST_USER_REPOSITORY)
    protected readonly anilistUserRepository!: ANILIST_USER_REPOSITORY;

    @Inject()
    protected readonly anilistUserManager!: AnilistUserManager;

    @Get("/:user/:list")
    public async get(
        @PathParams("user") userName: string,
        @PathParams("list") listName: string
    ): Promise<IMetadata>
    {
        const user = await this.anilistUserManager.getUserByName(userName);

        if(!user)
            throw new Error("No such user");

        const userList = user.lists?.find(list => list.listName === listName);

        if(!userList)
            throw new Error("No such list");

        return {
            allowChunkMerge: userList.allowChunkMerge,

            savedData: userList.savedData.data
        };
    }

    @Put("/:user/:list")
    @CustomAuth("pathParams.user == currentUser.name")
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