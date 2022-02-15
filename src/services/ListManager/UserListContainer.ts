import {UserList} from "../../entity/UserList";
import {ChunkService} from "../ChunkService";
import {EntryService} from "../EntryService";
import {Entry} from "../ChunkService/Entry";
import {ChunkList} from "../../dto/ChunkList";

export class UserListContainer
{
    public readonly userList: UserList;

    protected chunkService: ChunkService;

    protected entryService: EntryService;

    constructor(userList: UserList, chunkService: ChunkService, entryService: EntryService)
    {
        this.userList = userList;

        this.chunkService = chunkService;
        this.entryService = entryService;
    }

    get userName(): string
    {
        return this.userList.userName;
    }

    get listName(): string
    {
        return this.userList.listName;
    }

    async toEntries(): Promise<Array<Entry>>
    {
        // @TODO: Add caching?
        return await this.entryService.getEntries(this);
    }

    async toChunkList(): Promise<ChunkList>
    {
        // @TODO: Add caching?
        return await this.chunkService.chunkize(this);
    }
}