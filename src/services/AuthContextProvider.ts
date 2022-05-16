import {AuthContextProvider, AuthContextProviderInterface} from "@jojoxd/tsed-auth";
import {JsonParameterStore} from "@tsed/schema";
import {AnilistService} from "@anime-rss-filter/anilist";
import {Inject} from "@tsed/di";
import {AnilistUserManager} from "./AnilistUserManager";
import {Context} from "@tsed/platform-params";

@AuthContextProvider()
export class CustomAuthContextProvider implements AuthContextProviderInterface
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
