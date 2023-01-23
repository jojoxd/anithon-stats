import {SearchGlobalListDto, SearchGlobalResponse, UserDto, UserId} from "@anistats/shared";
import {Inject, Injectable, ProviderScope} from "@tsed/di";
import {UserDomainService, SearchUserDomainService} from "../../../domain/service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {UserEntity} from "../../../domain/entity/user/user.entity";
import {UserRepository} from "../../../domain/repository/user/user.repository";
import {InjectSession, Session} from "@jojoxd/tsed-util/express-session";

@Injectable({ scope: ProviderScope.REQUEST, })
export class SearchGlobalApplicationService
{
	@Inject()
	protected searchUserService!: SearchUserDomainService;

	// @Inject()
	// protected searchListService!: SearchListDomainService;

	@Inject()
	protected userService!: UserDomainService;

	@InjectRepository(UserEntity)
	protected userRepository!: UserRepository;

	public async search(query: string): Promise<SearchGlobalResponse>
	{
		return {
			users: await this.searchUsers(query),

			lists: await this.searchLists(query),
		};
	}

	protected async searchUsers(query: string): Promise<Array<UserDto>>
	{
		const users = await this.searchUserService.searchUsers(query);

		return users.map(user => this.userService.convertUserToDto(user));
	}

	protected async searchLists(query: string): Promise<Array<SearchGlobalListDto>>
	{
		return []; // @TODO: Use req.user instead of session
//		const userId = this.session?.userId ?? null;
//
//		if (!userId) {
//			return [];
//		}
//
//		// @TODO: Load ListMetadata, convert to ListMetadataDto, then to SearchGlobalListDto { id: list.id, ...listMetadataDto };
//		return [];
	}
}
