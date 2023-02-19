import {SearchGlobalListDto, SearchGlobalResponse, UserDto} from "@anistats/shared";
import {Inject, Injectable, ProviderScope} from "@tsed/di";
import {SearchUserDomainService} from "../../../domain/service/search/search-user.domain-service";
import {UserDomainService} from "../../../domain/service/user/user.domain-service";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {UserEntity} from "../../../domain/entity/user/user.entity";
import {UserRepository} from "../../../domain/repository/user/user.repository";

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

	public async search(query: string, user?: UserEntity): Promise<SearchGlobalResponse>
	{
		return {
			users: await this.searchUsers(query),

			lists: user ? await this.searchLists(query, user) : [],
		};
	}

	protected async searchUsers(query: string): Promise<Array<UserDto>>
	{
		const users = await this.searchUserService.searchUsers(query);

		return users.map(user => this.userService.convertUserToDto(user));
	}

	protected async searchLists(query: string, user: UserEntity): Promise<Array<SearchGlobalListDto>>
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
