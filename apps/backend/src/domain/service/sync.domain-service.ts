import {Inject, Service} from "@tsed/di";
import {UserEntity} from "../entity/user/user.entity";
import {ListEntity} from "../entity/list/list.entity";
import {AnilistListDomainService} from "./anilist/list/anilist-list.domain-service";
import {AnilistListView} from "../view/anilist/list/anilist-list.view";
import {UserRepository} from "../repository/user/user.repository";
import {UseTransaction} from "../../datasources/use-transaction.decorator";
import {SqliteDataSource} from "../../datasources/sqlite.data-source";
import {ListRepository} from "../repository/list/list.repository";
import {ListEntityFactory} from "../factory/list/list-entity.factory";
import {SyncEntriesDomainService} from "./sync/sync-entries.domain-service";

@Service()
export class SyncDomainService
{
	@Inject()
	protected anilistListService!: AnilistListDomainService;

	@Inject(UserRepository)
	protected userRepository!: UserRepository;

	@Inject(ListRepository)
	protected listRepository!: ListRepository;

	@Inject()
	protected syncEntriesService!: SyncEntriesDomainService;

	/**
	 * Synchronizes everything of a user
	 *
	 * NOTE: Syncing entries will result in a 429 on anilist API when a user has way too many items
	 */
	@UseTransaction(SqliteDataSource)
	public async syncUser(user: UserEntity, syncEntries: boolean = false): Promise<void>
	{
		console.log("SYNC USER", user);

		const anilistLists = await this.anilistListService.getLists(user);
		const diff = this.getListDiff(user, anilistLists);

		for (const addedList of diff.added) {
			const list = ListEntityFactory.create(addedList.name, user);

			await this.listRepository.save(list);
		}

		for (const removedList of diff.removed) {
			user.lists = user.lists.filter(userList => userList.name !== removedList.name);
		}

		if(syncEntries) {
			for(const list of user.lists) {
				await this.syncList(
					list,
					anilistLists.find(anilistList => anilistList.name === list.name)!
				);
			}
		}

		user.synchronizedAt = new Date();

		await this.userRepository.save(user);
	}

	/**
	 * Synchronizes a single list
	 */
	@UseTransaction(SqliteDataSource)
	public async syncList(list: ListEntity, anilistListView: AnilistListView): Promise<void>
	{
		// @TODO: Ensure list names are correct?

		await this.syncEntriesService.syncEntries(list, anilistListView);

		list.synchronizedAt = new Date();

		await this.listRepository.save(list);
	}

	protected getListDiff(user: UserEntity, anilistLists: Array<AnilistListView>): { added: Array<AnilistListView>, removed: Array<ListEntity>, }
	{
		const userListNames = user.lists.map(list => list.name);
		const anilistListNames = anilistLists.map(list => list.name);

		const added = anilistListNames
			.filter(anilistListName => !userListNames.includes(anilistListName))
			.map(anilistListName => anilistLists.find(anilistList => anilistList.name === anilistListName)!);

		const removed = userListNames
			.filter(userListName => !anilistListNames.includes(userListName))
			.map(userListName => user.lists.find(userList => userList.name === userListName)!);

		return {
			added,
			removed,
		};
	}
}
