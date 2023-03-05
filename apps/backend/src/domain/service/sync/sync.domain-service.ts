import {Inject, Service} from "@tsed/di";
import {UserEntity} from "../../entity/user/user.entity";
import {ListEntity} from "../../entity/list/list.entity";
import {AnilistListDomainService} from "../anilist/list/anilist-list.domain-service";
import {UserRepository} from "../../repository/user/user.repository";
import {ListRepository} from "../../repository/list/list.repository";
import {ListEntityFactory} from "../../factory/list/list-entity.factory";
import {SyncEntriesDomainService} from "../sync/sync-entries.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {TimeUtil} from "../../util/time.util";
import {DateTime} from "luxon";
import {SyncSeriesDomainService} from "../sync/sync-series.domain-service";
import {CountCall} from "@jojoxd/tsed-util/prometheus";
import {MediaListGroupView} from "../../view/anilist/list/get-user-lists/media-list-group.view";
import {MediaListCollectionView} from "../../view/anilist/list/get-user-lists/media-list-collection.view";
import { $log } from "@tsed/common";

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
	@CountCall("sync_user", "Times a user has been synced")
	public async syncUser(user: UserEntity, force: boolean = false): Promise<void>
	{
		console.log("SYNC USER", user);

		const mediaListCollectionView = await this.anilistListService.getLists(user);
		const diff = this.getListDiff(user, mediaListCollectionView);

		for (const addedList of diff.added) {
			const list = ListEntityFactory.create(addedList.name, user);

			await this.listRepository.persist(list);
		}

		await this.listRepository.flush();

		for (const removedList of diff.removed) {
			user.lists.set(
				user.lists
					.getItems()
					.filter(userList => userList.name !== removedList.name)
			);
		}

		for(const list of user.lists) {
			const hasTimedOut = TimeUtil.hasTimedOut(list.synchronizedAt, { day: 1,  }, DateTime.now());

			const mediaListGroupView = mediaListCollectionView.lists.find(mediaListGroupView => mediaListGroupView.name === list.name);

			if (!mediaListGroupView) {
				$log.warn(`Failed to get mediaListGroupView of ${user.name}/${list.name}`);
				continue;
			}

			if (force || hasTimedOut) {
				await this.syncList(list, mediaListGroupView);
			}
		}

		user.synchronizedAt = new Date();

		await this.userRepository.persistAndFlush(user);
	}

	/**
	 * Synchronizes a single list
	 */
	//@Transactional()
	@CountCall("sync_list", "Times a list has been synced")
	public async syncList(list: ListEntity, mediaListGroupView?: MediaListGroupView): Promise<void>
	{
		if (!mediaListGroupView) {
			mediaListGroupView = await this.anilistListService.getList(list) ?? undefined;

			// @TODO: Is it correct to throw here?
			if (!mediaListGroupView) {
				throw new Error("No listview found on anilist that matches the list");
			}
		}

		// @TODO: Ensure list names are correct?

		await this.syncEntriesService.syncEntries(list, mediaListGroupView);

		list.synchronizedAt = new Date();

		await this.listRepository.persist(list);
	}

	protected getListDiff(user: UserEntity, mediaListCollectionView: MediaListCollectionView): { added: Array<MediaListGroupView>, removed: Array<ListEntity>, }
	{
		const userListNames = user.lists.getItems().map(list => list.name);
		const anilistListNames = mediaListCollectionView.lists.map(list => list.name);

		const added = anilistListNames
			.filter((anilistListName) => {
				return !userListNames.includes(anilistListName);
			})
			.map((anilistListName) => {
				return mediaListCollectionView.lists.find((mediaListCollectionView) => {
					return mediaListCollectionView.name === anilistListName;
				})!;
			});

		const removed = userListNames
			.filter((userListName) => {
				return !anilistListNames.includes(userListName);
			})
			.map((userListName) => {
				return user.lists.getItems()
					.find(userList => userList.name === userListName)!;
			});

		return {
			added,
			removed,
		};
	}
}
