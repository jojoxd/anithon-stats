import {Inject, Service} from "@tsed/di";
import {ANILIST_USER_REPOSITORY} from "../entity/repository/AnilistUserRepository";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {AnilistUser} from "../entity/AnilistUser";
import {UserList} from "../entity/UserList";
import { $log } from "@tsed/common";
import {Mutex} from "async-mutex";

class MutexManager
{
    readonly mutexes: { [k: string]: Mutex } = {};

    getMutex(name: string): Mutex
    {
        this.mutexes[name] ??= new Mutex();

        return this.mutexes[name]!;
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

    async getUserByName(userName: string, forceUpdate: boolean = false): Promise<AnilistUser | null>
    {
        const mutex = MUTEXES.getMutex(userName);

        return mutex.runExclusive(async () => {
            let user: AnilistUser | null = null;

            // @TODO: This needs to be ID based (anilistUserId) as username can change on anilist

            try {
                user = await this.anilistUserRepository.findUserByName(userName.toLowerCase());
            } catch(e) {
                $log.warn(e);
            }

            if(user === null) {
                $log.info(`Creating user ${userName}`);
                user = new AnilistUser();

                const userData = await this.anilistService.getUser(userName);

                if(!userData)
                    throw new Error("User does not exist on anilist");

                user.userName = userName.toLowerCase();
                user.anilistUserId = userData.id;
                forceUpdate = true;
            }

            const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60;

            if(forceUpdate || (user.lastUpdated && (Number(user.lastUpdated) + ONE_DAY_IN_MILLISECONDS) <= Date.now())) {
                // Update lists
                const userLists = await this.anilistService.getUserLists(user.userName, MediaType.ANIME);

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

            return user;
        });
    }
}
