import {Inject, Service} from "@tsed/di";
import {UserList} from "../entity/UserList";
import {UserListContainer} from "./ListManager/UserListContainer";
import {ChunkService} from "./ChunkService";
import {EntryService} from "./EntryService";

@Service()
export class UserListContainerManager
{
    @Inject()
    protected readonly chunkService!: ChunkService;

    @Inject()
    protected readonly entryService!: EntryService;

    async createFromList(list: UserList): Promise<UserListContainer>
    {
        return new UserListContainer(list, this.chunkService, this.entryService);
    }
}