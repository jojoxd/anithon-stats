import {Inject, Service} from "@tsed/di";
import {ANILIST_USER_REPOSITORY} from "../entity/repository/AnilistUserRepository";
import {AnilistService, IAnilistUser, MediaType} from "@anime-rss-filter/anilist";
import {AnilistUser} from "../entity/AnilistUser";
import {UserList} from "../entity/UserList";
import { $log } from "@tsed/common";
import {Mutex} from "async-mutex";

class MutexManager
{
    readonly mutexes: { [k: number | string]: Mutex } = {};

    getMutex(anilistId: number | string): Mutex
    {
        this.mutexes[anilistId] ??= new Mutex();

        return this.mutexes[anilistId]!;
    }
}

const MUTEXES = new MutexManager();

@Service()
export class AnilistUserManager
{
    @Inject(ANILIST_USER_REPOSITORY)
    protected anilistUserRepository!: ANILIST_USER_REPOSITORY;

    @Inject()
    protected anilistService!: AnilistService;

    async getUserByAnilistId(anilistId: number, forceUpdate: boolean = false): Promise<AnilistUser | null>
    {
        const mutex = MUTEXES.getMutex(anilistId);

        return mutex.runExclusive(async () => {
            let user: AnilistUser | null = null;

            try {
                user = await this.anilistUserRepository.findUserByAnilistId(anilistId);
            } catch(e) {
                $log.warn(e);
            }

            if(user === null) {
                $log.info(`Creating user (ID:${anilistId})`);

                const userData = await this.anilistService.getUserById(anilistId);

                user = await this.createUser(userData);
                forceUpdate = true;
            }

            const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60;

            if(forceUpdate || (user.lastUpdated && (Number(user.lastUpdated) + ONE_DAY_IN_MILLISECONDS) <= Date.now())) {
                return this.updateUser(user);
            }

            return user;
        });
    }

    async findUserByListId(listId: string): Promise<AnilistUser | null>
    {
        return this.anilistUserRepository.findByListId(listId);
    }

    async getUserByName(userName: string, forceUpdate: boolean = false): Promise<AnilistUser | null>
    {
        const mutex = MUTEXES.getMutex(userName);

        return mutex.runExclusive(async () => {
            let user: AnilistUser | null = null;

            try {
                user = await this.anilistUserRepository.findUserByName(userName);
            } catch(e) {
                $log.warn(e);
            }

            if(user === null) {
                $log.info(`Creating user (userName:${userName})`);

                const userData = await this.anilistService.searchUserByName(userName);
                user = await this.createUser(userData);
                forceUpdate = true;
            }

            const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60;

            if(forceUpdate || (user.lastUpdated && (Number(user.lastUpdated) + ONE_DAY_IN_MILLISECONDS) <= Date.now())) {
                return this.updateUser(user);
            }

            return user;
        });
    }

    async getUserByUuid(uuid: string, forceUpdate: boolean = false): Promise<AnilistUser | null>
    {
        const mutex = MUTEXES.getMutex(uuid);

        return mutex.runExclusive(async () => {
            let user: AnilistUser | null = null;

            try {
                user = await this.anilistUserRepository.findUserByUuid(uuid);
            } catch(e) {
                $log.warn(e);
            }

            if(user === null) {
                return null;
            }

            const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60;

            if(forceUpdate || (user.lastUpdated && (Number(user.lastUpdated) + ONE_DAY_IN_MILLISECONDS) <= Date.now())) {
                return this.updateUser(user);
            }

            return user;
        });
    }

    protected async createUser(userData: IAnilistUser): Promise<AnilistUser>
    {
        $log.info(`Creating user (ID:${userData.id})`);
        let user = new AnilistUser();

        if(!userData)
            throw new Error("User does not exist on anilist");

        $log.info(`UserId ${userData.id} = ${userData.name}`);

        user.userName = userData.name;
        user.anilistUserId = userData.id;

        user.lastUpdated = new Date(0);

        return this.anilistUserRepository.save(user);
    }

    protected async updateUser(user: AnilistUser): Promise<AnilistUser>
    {
        // Update lists
        const userLists = await this.anilistService.getUserLists(user.anilistUserId, MediaType.ANIME);

        if (!user.lists)
            user.lists = [];

        for (const userList of userLists.MediaListCollection!.lists!) {
            let list = user.lists.find(list => list.listName === userList!.name!);

            if (!list) {
                list = new UserList();
                list.listName = userList!.name!;

                user.lists.push(list);
            }

            list.user = user;
        }

        user.lastUpdated = new Date();

        return this.anilistUserRepository.save(user);
    }
}
