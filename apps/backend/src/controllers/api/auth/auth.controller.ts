import { Authenticate, Authorize } from "@tsed/passport";
import { Controller, Req, Get } from "@tsed/common";

@Controller("/auth")
export class AuthController
{
	@Get("/login")
	@Authenticate("anilist", { session: false, })
	loginAnilist(@Req("user") user?: any): any
	{
		console.log('AuthController::loginAnilist() called with user =', user);

		return user;
	}

	@Get("/test")
	@Authorize("jwt")
	testAnilistAuth(@Req("user") user?: any): any
	{
		return user;
	}
}
