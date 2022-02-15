import {ChunkService} from "./ChunkService";
import {EntryService} from "./EntryService";
import {Inject} from "@tsed/di";
import {UserListRepository} from "../entity/UserListRepository";
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

    @Inject()
    protected readonly userListRepository!: UserListRepository;

    async getList(user: string, list: string): Promise<UserListContainer>
    {
        const userList = await this.userListRepository.findOrCreate(user, list);

        return new UserListContainer(userList, this.chunkService, this.entryService);
    }
}
