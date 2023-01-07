import {Service} from "@tsed/di";
import {UserEntity} from "../entity/user/user.entity";
import {ListEntity} from "../entity/list/list.entity";

@Service()
export class SyncDomainService
{
	/**
	 * Synchronizes everything of a user
	 */
	public async syncUser(user: UserEntity): Promise<void>
	{

	}

	/**
	 * Synchronizes a single list
	 */
	public async syncList(list: ListEntity): Promise<void>
	{

	}
}
