import {Inject, Service} from "@tsed/di";
import {UserEntity} from "../entity/user/user.entity";
import {ListEntity} from "../entity/list/list.entity";
import {AnilistListDomainService} from "./anilist/list/anilist-list.domain-service";
import {AnilistListView} from "../view/anilist/list/anilist-list.view";
import {UserRepository} from "../repository/user/user.repository";
import {ListRepository} from "../repository/list/list.repository";
import {ListEntityFactory} from "../factory/list/list-entity.factory";
import {SyncEntriesDomainService} from "./sync/sync-entries.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {TimeUtil} from "../util/time.util";
import {DateTime} from "luxon";
import {SyncSeriesDomainService} from "./sync/sync-series.domain-service";

@Service()
export class SyncDomainService
{
	@Inject()
	protected anilistListService!: AnilistListDomainService;

	@InjectRepository(UserEntity)
	protected userRepository!: UserRepository;

	@InjectRepository(ListEntity)
	protected listRepository!: ListRepository;

	@Inject()
	protected syncEntriesService!: SyncEntriesDomainService;

	@Inject()
	protected syncSeriesService!: SyncSeriesDomainService;

	/**
	 * Synchronizes everything of a user
	 *
	 * NOTE: Syncing entries will result in a 429 on anilist API when a user has way too many items
	 */
	public async syncUser(user: UserEntity, force: boolean = false): Promise<void>
	{
		console.log("SYNC USER", user);

		const anilistLists = await this.anilistListService.getLists(user);
		const diff = this.getListDiff(user, anilistLists);

		for (const addedList of diff.added) {
			const list = ListEntityFactory.create(addedList.name, user);

			await this.listRepository.persist(list);
		}

		for (const removedList of diff.removed) {
			user.lists.set(
				user.lists
					.getItems()
					.filter(userList => userList.name !== removedList.name)
			);
		}

		for(const list of user.lists) {
			const hasTimedOut = TimeUtil.hasTimedOut(list.synchronizedAt, { day: 1,  }, DateTime.now());
			if (force || hasTimedOut) {
				await this.syncList(
					list,
					anilistLists.find(anilistList => anilistList.name === list.name)!
				);
			}
		}

		user.synchronizedAt = new Date();

		await this.userRepository.persist(user);
	}

	/**
	 * Synchronizes a single list
	 */
	//@Transactional()
	public async syncList(list: ListEntity, anilistListView?: AnilistListView): Promise<void>
	{
		if (!anilistListView) {
			anilistListView = await this.anilistListService.getList(list) ?? undefined;

			// @TODO: Is it correct to throw here?
			if (!anilistListView) {
				throw new Error("No listview found on anilist that matches the list");
			}
		}

		// @TODO: Ensure list names are correct?

		await this.syncEntriesService.syncEntries(list, anilistListView);

		list.synchronizedAt = new Date();

		await this.listRepository.persist(list);
	}

	protected getListDiff(user: UserEntity, anilistLists: Array<AnilistListView>): { added: Array<AnilistListView>, removed: Array<ListEntity>, }
	{
		const userListNames = user.lists.getItems().map(list => list.name);
		const anilistListNames = anilistLists.map(list => list.name);

		const added = anilistListNames
			.filter(anilistListName => !userListNames.includes(anilistListName))
			.map(anilistListName => anilistLists.find(anilistList => anilistList.name === anilistListName)!);

		const removed = userListNames
			.filter(userListName => !anilistListNames.includes(userListName))
			.map(userListName => user.lists.getItems().find(userList => userList.name === userListName)!);

		return {
			added,
			removed,
		};
	}
}
