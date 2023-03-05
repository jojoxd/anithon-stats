import {Inject, Injectable, ProviderScope} from "@tsed/di";
import {UserDto} from "@anistats/shared";
import {UserEntity} from "../../entity/user/user.entity";
import {ListEntity} from "../../entity/list/list.entity";
import {UserRepository} from "../../repository/user/user.repository";
import {ListMetadataDomainService} from "../list/metadata/list-metadata.domain-service";
import {SyncDomainService} from "../sync/sync.domain-service";
import {AnilistUserDomainService} from "../anilist/user/anilist-user.domain-service";
import {$log} from "@tsed/common";
import {UserEntityFactory} from "../../factory/user/user-entity.factory";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import { AnilistUserView } from "../../view/anilist/user/anilist-user.view";

@Injectable({ scope: ProviderScope.REQUEST, })
export class UserDomainService
{
	@InjectRepository(UserEntity)
	protected readonly userRepository!: UserRepository;

	@Inject()
	protected readonly listMetadataService!: ListMetadataDomainService;

	@Inject()
	protected readonly syncService!: SyncDomainService;

	@Inject()
	protected readonly anilistUserService!: AnilistUserDomainService;

	public async getUserFromList(list: ListEntity): Promise<UserDto>
	{
		await list.user.load();

		return this.convertUserToDto(list.user.getEntity());
	}

	public convertUserToDto(user: UserEntity): UserDto
	{
		return {
			id: user.id,
			name: user.name,

			avatar: user.avatarUrl,
		}
	}

	public async onboardAnilistUser(anilistUser: AnilistUserView): Promise<UserEntity>
	{
		let user = await this.userRepository.findOne({ anilistId: anilistUser.id, });

		// @NOTE: Do we want to support user renaming from anilist?

		// Create if not exists
		if (!user) {
			$log.info(`Creating new User: ${anilistUser.userName} (${anilistUser.id})`);
			user = UserEntityFactory.createFromAnilistUser(anilistUser);

			await this.userRepository.persist(user);
		}

		await this.syncService.syncUser(user, true);

		return user;
	}

	/**
	 * @deprecated
	 */
	public async getCurrentUser(): Promise<UserEntity | null>
	{
		// @TODO: use req.user instead of session
		return null;
//
//		const userId = this.session?.userId ?? null;
//
//		if (!userId) {
//			return null;
//		}
//
//		return this.userRepository.findOne({ id: userId });
	}
}
