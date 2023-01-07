import {Inject, Service} from "@tsed/di";
import {UserDto} from "@anistats/shared";
import {UserEntity} from "../entity/user/user.entity";
import {ListEntity} from "../entity/list/list.entity";
import {UserRepository} from "../repository/user/user.repository";
import {ListMetadataDomainService} from "./list-metadata.domain-service";
import {SyncDomainService} from "./sync.domain-service";

@Service()
export class UserDomainService
{
	@Inject(UserRepository)
	protected readonly userRepository!: UserRepository;

	@Inject()
	protected listMetadataService!: ListMetadataDomainService;

	@Inject()
	protected readonly syncService!: SyncDomainService;

	public async getUserFromList(list: ListEntity): Promise<UserDto>
	{
		return this.convertUserToDto(list.user)
	}

	public convertUserToDto(user: UserEntity): UserDto
	{
		return {
			id: user.id,
			name: user.name,

			avatar: user.avatarUrl,
		}
	}

	public async onboardAnilistUser(anilistId: any): Promise<UserEntity>
	{
		let user = await this.userRepository.findOneBy({ anilistId, });

		// @NOTE: Do we want to support user renaming from anilist?

		// Create if not exists
		if (!user) {
			user = new UserEntity();

			// @TODO: Fetch from anilist
			user.name = "jojoxd";
			user.avatarUrl = "http://null";
			user.anilistId = anilistId;

			await this.userRepository.save(user);
		}

		await this.syncService.syncUser(user);

		return user;
	}
}
