import {Inject, Service} from "@tsed/di";
import {ListId, ListMetadataDto, UserId, UserListsResponse, UserResponse} from "@anistats/shared";
import {UserRepository} from "../../domain/repository/user/user.repository";
import {NotFound} from "@tsed/exceptions";
import {UserDomainService} from "../../domain/service/user.domain-service";
import {ListMetadataDomainService} from "../../domain/service/list-metadata.domain-service";
import {UserEntity} from "../../domain/entity/user/user.entity";

@Service()
export class UserApplicationService
{
	@Inject(UserRepository)
	protected userRepository!: UserRepository;

	@Inject()
	protected userService!: UserDomainService;

	@Inject()
	protected listMetadataService!: ListMetadataDomainService;

	public async getLists(userId: UserId): Promise<UserListsResponse>
	{
		const user = await this.getUserOrThrow(userId);

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
			user = await this.userRepository.findOneBy({ id: userId });
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
