import {$log, Controller, Inject, PathParams, ProviderScope, Scope, Session} from "@tsed/common";
import {AnilistService} from "@anime-rss-filter/anilist";
import {ContentType, Get} from "@tsed/schema";
import {ICurrentUser} from "@anistats/shared";
import {AnilistUserManager} from "../../services/AnilistUserManager";

@Controller("/user")
@Scope(ProviderScope.REQUEST)
export class UserController
{
    @Inject()
    protected anilistService!: AnilistService;

    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Get("/@current")
    @ContentType("application/json")
    async getCurrentUser(@Session() session: any): Promise<ICurrentUser>
    {
        const currentUser = await this.anilistService.getCurrentUser();

        if(!currentUser) {
            return { isAuthenticated: false };
        }

        return { ...currentUser, isAuthenticated: true, isCurrentUser: true };
    }

    @Get("/:userName")
    @ContentType("application/json")
    async getFindUser(@PathParams("userName") userName: string)
    {
        $log.info(`Find User: ${userName}`);

        const currentUser = await this.anilistService.getCurrentUser();

        const user = await this.anilistService.searchUserByName(userName);

        if(!user)
            return null;

        this.anilistUserManager.getUserByAnilistId(user.id);

        return {
            ...user,
            isCurrentUser: user.id === currentUser?.id,
        };
    }
}
