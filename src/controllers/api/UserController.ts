import {$log, Controller, Inject, ProviderScope, Scope, Session} from "@tsed/common";
import {AnilistService} from "@anime-rss-filter/anilist";
import {ContentType, Get} from "@tsed/schema";
import {ICurrentUser} from "@anistats/shared";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
export class UserController
{
    @Inject()
    protected anilistService!: AnilistService;

    @Get("/current")
    @ContentType("application/json")
    async getCurrentUser(@Session() session: any): Promise<ICurrentUser>
    {
        const currentUser = await this.anilistService.getCurrentUser();

        if(!currentUser) {
            return { isAuthenticated: false };
        }

        return { ...currentUser, isAuthenticated: true };
    }
}
