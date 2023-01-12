import {Inject, Service} from "@tsed/di";
import {UserDto} from "@anistats/shared";
import {UserEntity} from "../entity/user/user.entity";
import {ListEntity} from "../entity/list/list.entity";
import {UserRepository} from "../repository/user/user.repository";
import {ListMetadataDomainService} from "./list-metadata.domain-service";
import {SyncDomainService} from "./sync.domain-service";
import {AnilistUserDomainService} from "./anilist/user/anilist-user.domain-service";
import { $log } from "@tsed/common";
import {AnilistUserView} from "../view/anilist/anilist-user.view";
import {UserEntityFactory} from "../factory/user/user-entity.factory";
import {InjectRepository} from "../../ext/mikro-orm/inject-repository.decorator";

@Service()
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
}
