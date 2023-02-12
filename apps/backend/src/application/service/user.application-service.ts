import {Inject, Service} from "@tsed/di";
import {ListId, ListMetadataDto, UserId, UserListsResponse, UserResponse} from "@anistats/shared";
import {UserRepository} from "../../domain/repository/user/user.repository";
import {NotFound} from "@tsed/exceptions";
import {UserDomainService} from "../../domain/service/user/user.domain-service";
import {ListMetadataDomainService} from "../../domain/service/list/metadata/list-metadata.domain-service";
import {UserEntity} from "../../domain/entity/user/user.entity";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {SyncDomainService} from "../../domain/service/sync/sync.domain-service";

@Service()
export class UserApplicationService
{
	@InjectRepository(UserEntity)
	protected userRepository!: UserRepository;

	@Inject()
	protected userService!: UserDomainService;

	@Inject()
	protected listMetadataService!: ListMetadataDomainService;

	@Inject()
	protected syncService!: SyncDomainService;

	public async getLists(userId: UserId): Promise<UserListsResponse>
	{
		const user = await this.getUserOrThrow(userId);

		await this.syncService.syncUser(user, false);

		await user.lists.init({ populate: true });

		const lists: Record<ListId, ListMetadataDto> = {};
		for(const list of user.lists) {
			lists[list.id] = await this.listMetadataService.getMetadata(list);
		}

		return {
			user: this.userService.convertUserToDto(user),

			lists,
		};
	}

	protected async getUserOrThrow(userId: UserId): Promise<UserEntity>
	{
		let user: UserEntity | null = null;

		try {
			user = await this.userRepository.findOne({ id: userId });
		} catch(e: any) {
			throw new NotFound("Could not fetch user", e);
		}

		if (!user) {
			throw new NotFound(`User ${userId} not found`);
		}

		return user;
	}

	async getUser(userId: UserId): Promise<UserResponse>
	{
		const user = await this.getUserOrThrow(userId);

		return {
			user: this.userService.convertUserToDto(user),
		};
	}
}
