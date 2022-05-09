import {UserList} from "../UserList";
import {SavedData} from "../SavedData";
import {Mutex} from "async-mutex";
import {SqliteDataSource} from "../../datasources/SqliteDataSource";
import {registerProvider} from "@tsed/di";
import {AnilistUser} from "../AnilistUser";

/**
 * We need a mutex for findOrCreate, or we may create 2 UserLists when first-timing /api/:user/list/:list
 */
const findOrCreateMutex = new Mutex();

export const UserListRepository = SqliteDataSource.getRepository(UserList).extend({
    // // @TODO: Migrate to AnilistUser
    // async findOrCreate(user: AnilistUser, listName: string)
    // {
    //     return findOrCreateMutex.runExclusive(async () => {
    //         try {
    //             return await this.findOneOrFail({ where: { user, listName } });
    //         } catch(ignored) {
    //             let userList = this.create({ user, listName });
    //             userList.savedData = new SavedData();
    //
    //             await this.save(userList);
    //
    //             return userList;
    //         }
    //     });
    // }
});

export const USERLIST_REPOSITORY = Symbol.for("UserListRepository");
export type USERLIST_REPOSITORY = typeof UserListRepository;

registerProvider<USERLIST_REPOSITORY>({
    provide: USERLIST_REPOSITORY,
    useValue: UserListRepository,
});
