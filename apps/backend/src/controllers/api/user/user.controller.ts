import {Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {UserId, UserResponse, UserListsResponse} from "@anistats/shared";
import {UserApplicationService} from "../../../application/service/user.application-service";
import { PathParams, Session } from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";

@Controller("/user")
export class UserController
{
	@Inject()
	protected userService!: UserApplicationService;

	@Get('/')
	async getCurrentUser(@Session() session: Session): Promise<UserResponse>
	{
		if(!session?.userId) {
			throw new Unauthorized("Not logged in");
		}

		return this.userService.getUser(session.userId);
	}

	@Get('/:userId')
	async getUser(@PathParams('userId') userId: UserId): Promise<UserResponse>
	{
		return this.userService.getUser(userId);
	}

	@Get('/:userId/lists')
	async getLists(@PathParams('userId') userId: UserId): Promise<UserListsResponse>
	{
		return this.userService.getLists(userId);
	}
}
