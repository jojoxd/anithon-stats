import {ChunkService} from "./ChunkService";
import {EntryService} from "./EntryService";
import {Inject} from "@tsed/di";
import {USERLIST_REPOSITORY, UserListRepository} from "../entity/repository/UserListRepository";
import {UserListContainer} from "./ListManager/UserListContainer";

/**
 * Creates a helper that wraps a list
 */
export class ListManager
{
    @Inject()
    protected readonly chunkService!: ChunkService;

    @Inject()
    protected readonly entryService!: EntryService;

    @Inject(USERLIST_REPOSITORY)
    protected readonly userListRepository!: USERLIST_REPOSITORY;

    async getList(user: string, list: string): Promise<UserListContainer>
    {
        const userList = await this.userListRepository.findOrCreate(user, list);

        return new UserListContainer(userList, this.chunkService, this.entryService);
    }
}
