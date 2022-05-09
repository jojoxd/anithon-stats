import {ChunkService} from "./ChunkService";
import {EntryService} from "./EntryService";
import {Inject} from "@tsed/di";
import {USERLIST_REPOSITORY} from "../entity/repository/UserListRepository";
import {UserListContainer} from "./ListManager/UserListContainer";
import {ANILIST_USER_REPOSITORY} from "../entity/repository/AnilistUserRepository";
import {AnilistUserManager} from "./AnilistUserManager";

/**
 * Creates a helper that wraps a list
 */
export class ListManager
{
    @Inject()
    protected readonly chunkService!: ChunkService;

    @Inject()
    protected readonly entryService!: EntryService;

    @Inject()
    protected readonly anilistUserManager!: AnilistUserManager;

    async getList(userName: string, listName: string): Promise<UserListContainer>
    {
        const user = await this.anilistUserManager.getUserByName(userName);

        if(!user)
            throw new Error("Undefined behavior: user is not defined / null");

        const userList = user.lists?.find((list) => list.listName === listName);

        if(!userList)
            throw new Error("User has no such list");

        return new UserListContainer(userList, this.chunkService, this.entryService);
    }
}
