import {AuthExpressionContextProvider, AuthExpressionContextProviderMethods} from "@jojoxd/tsed-auth-expression";
import {AnilistService} from "@anistats/anilist";
import {Inject} from "@tsed/di";
import {AnilistUserManager} from "./AnilistUserManager";
import {Context} from "@tsed/platform-params";

@AuthExpressionContextProvider()
export class CustomAuthContextProvider implements AuthExpressionContextProviderMethods
{
	constructor()
	{
		console.log("AUTH CONTEXT PROVIDER CREATED");
	}

	@Inject()
	protected readonly anilistService!: AnilistService;

	@Inject()
	protected readonly anilistUserManager!: AnilistUserManager;

	async getContext(context: Context): Promise<any>
	{
		console.log("AUTH CONTEXT PROVIDER RUNS");
		const ctx: any = {};

		ctx.currentUser = await this.anilistService.getCurrentUser();
		if(ctx.currentUser) {
			ctx.currentUser = await this.anilistUserManager.getUserByAnilistId(ctx.currentUser.id);
		}

		console.log("Current User", ctx.currentUser);

		return ctx;
	}
}
