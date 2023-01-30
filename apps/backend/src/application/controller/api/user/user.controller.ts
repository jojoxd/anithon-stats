import {Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {UserId, UserResponse, UserListsResponse} from "@anistats/shared";
import {UserApplicationService} from "../../../service/user.application-service";
import { PathParams, Req, Session } from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import {Authorize} from "@tsed/passport";
import {UserEntity} from "../../../../domain/entity";

@Controller("/user")
export class UserController
{
	@Inject()
	protected userService!: UserApplicationService;

	@Get('/')
	@Authorize("jwt")
	async getCurrentUser(@Req('user') user: UserEntity): Promise<UserResponse>
	{
		return this.userService.getUser(user.id);
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
