import {UserList} from "../../entity/UserList";
import {ChunkService} from "../ChunkService";
import {EntryService} from "../EntryService";
import {Entry} from "../ChunkService/Entry";
import {ChunkList} from "../../dto/ChunkList";
import {UseCache} from "@tsed/platform-cache";

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
        return this.userList.user.userName;
    }

    get anilistUserId(): number
    {
        return this.userList.user.anilistUserId;
    }

    get listName(): string
    {
        return this.userList.listName;
    }

    @UseCache({ ttl: 10 })
    async toEntries(): Promise<Array<Entry>>
    {
        return await this.entryService.getEntries(this);
    }

    @UseCache({ ttl: 10 })
    async toChunkList(): Promise<ChunkList>
    {
        return await this.chunkService.chunkize(this);
    }
}
