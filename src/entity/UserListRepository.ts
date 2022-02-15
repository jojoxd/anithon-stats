import {EntityRepository, Repository} from "typeorm";
import {UserList} from "./UserList";
import {SavedData} from "./SavedData";
import {Mutex} from "async-mutex";

/**
 * We need a mutex for findOrCreate, or we may create 2 UserLists when first-timing /api/:user/list/:list
 */
const findOrCreateMutex = new Mutex();

@EntityRepository(UserList)
export class UserListRepository extends Repository<UserList>
{
    async findOrCreate(userName: string, listName: string)
    {
        return findOrCreateMutex.runExclusive(async () => {
            try {
                return await this.findOneOrFail({ userName, listName });
            } catch(ignored) {
                let userList = this.create({ userName, listName });
                userList.savedData = new SavedData();

                await this.save(userList);

                return userList;
            }
        });
    }
}
