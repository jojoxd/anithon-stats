import {Inject, Service} from "@tsed/di";
import {AnilistListService} from "@anistats/anilist";
import {ListAddEntryRequest, ListRemoveEntryRequest} from "@anistats/shared";
import {UserList} from "../entity/UserList";
import { $log } from "@tsed/common";

@Service()
export class UserListManager
{
	@Inject()
	protected anilistListService!: AnilistListService;

	async addEntry(list: UserList, request: ListAddEntryRequest)
	{
		const entryId = await this.anilistListService.addEntry(list.listName, request.anilistId);

		$log.info(`Added series ${request.anilistId} to list ${list.listName} (${list.id}), entryId = ${entryId}`);
	}

	async removeEntry(list: UserList, request: ListRemoveEntryRequest)
	{
		await this.anilistListService.removeEntry(list.listName, request.anilistId);
	}
}
