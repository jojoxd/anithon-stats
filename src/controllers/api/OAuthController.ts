import {Controller, Context, Constant, QueryParams, Session, $log, Inject} from "@tsed/common";
import {Get} from "@tsed/schema";
import {AnilistOAuthService} from "@anime-rss-filter/anilist/src/services/AnilistOAuthService";
import {ANILIST_USER_REPOSITORY, AnilistUserRepository} from "../../entity/repository/AnilistUserRepository";
import {AnilistUser} from "../../entity/AnilistUser";
import {AnilistService} from "@anime-rss-filter/anilist";

@Controller("/oauth")
export class OAuthController
{

    @Inject()
    protected readonly anilistOAuthService!: AnilistOAuthService;

    @Inject(ANILIST_USER_REPOSITORY)
    protected readonly anilistUserRepository!: ANILIST_USER_REPOSITORY;

    @Inject()
    protected readonly anilistService!: AnilistService;

    @Constant("EXTERNAL_API_URL")
    public readonly externalApiUrl!: string;

    get redirectUri()
    {
        return this.externalApiUrl + "/oauth/redirect";
    }

    // http://localhost:3000/api/oauth?redirect=<last-page>
    @Get("/")
    public getIndex(@Context() ctx: Context, @QueryParams("redirect") redirect: string, @Session() session: any)
    {
        session.oauth_redirect_next = redirect;

        session.save();

        return ctx.response.redirect(302, this.anilistOAuthService.getAuthorizeUri(this.redirectUri));
    }

    @Get("/redirect")
    public async getRedirect(@Context() ctx: Context, @QueryParams("code") code: string, @Session() session: any)
    {
        if(!session.oauth_redirect_next) {
            return "OK";
        }

        session.anilist_token = await this.anilistOAuthService.getToken(code, this.redirectUri);

        const redirectResponse = ctx.response.redirect(302, session.oauth_redirect_next);
        delete session.oauth_redirect_next;

        // @TODO: Do we need this onboarding if we have AnilistUserManager?
        // User Onboarding
        const currentUser = await this.anilistService.getCurrentUser();

        if(!currentUser)
            throw new Error("Something went wrong...");

        const user = new AnilistUser();
        user.userName = currentUser.name;
        user.anilistUserId = currentUser.id;

        // await this.anilistUserRepository.updateOrCreate(user);

        return redirectResponse;
    }

    @Get("/logout")
    public async getLogout(@Context() ctx: Context, @QueryParams("redirect") redirectTo: string, @Session() session: any)
    {
        await session.destroy();

        return ctx.response.redirect(302, redirectTo);
    }
}
