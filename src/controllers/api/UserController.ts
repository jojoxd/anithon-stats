import {$log, Controller, Inject, ProviderScope, QueryParams, Scope, Session} from "@tsed/common";
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

        return { ...currentUser, isAuthenticated: true, isCurrentUser: true };
    }

    @Get("/find")
    @ContentType("application/json")
    async getFindUser(@QueryParams("userName") userName: string)
    {
        $log.info(`Find User: ${userName}`);

        const currentUser = await this.anilistService.getCurrentUser();

        const user = await this.anilistService.getUser(userName);

        if(!user)
            return null;

        return {
            ...user,
            isCurrentUser: user.id === currentUser?.id,
        };
    }
}
