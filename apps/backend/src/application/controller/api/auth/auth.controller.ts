import { Authenticate } from "@tsed/passport";
import { Controller, Req, Get } from "@tsed/common";
import {ApiController} from "../../api.controller";
import { Constant } from "@tsed/di";

@Controller("/auth")
export class AuthController extends ApiController
{
	@Constant("EXTERNAL_API_URL")
	protected readonly externalApiUri!: string;

	@Get("/login")
	@Authenticate("anilist", { session: false, })
	loginAnilist(@Req('user') jwtResponse: { localToken: string }): any
	{
		const uri = new URL(this.externalApiUri);

		this.setCookie('token', jwtResponse.localToken, {
			domain: uri.hostname,
//			path: uri.pathname,

			httpOnly: true,
			sameSite: "strict",
		});

		return this.redirect('/', 302);
	}
}
