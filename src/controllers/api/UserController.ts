import {Controller, Inject, ProviderScope, Scope, Session} from "@tsed/common";
import {AnilistService} from "@anime-rss-filter/anilist";
import {Get} from "@tsed/schema";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
export class UserController
{
    @Inject()
    protected anilistService!: AnilistService;

    @Get("/current")
    async getCurrentUser(@Session() session: any)
    {
        // this.anilistService.setToken(session.anilist_token);

        return this.anilistService.getCurrentUser();
    }
}
