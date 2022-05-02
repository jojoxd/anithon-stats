import {Controller, Context, Constant, QueryParams, Session, $log, Inject} from "@tsed/common";
import {Get} from "@tsed/schema";
import {AnilistOAuthService} from "@anime-rss-filter/anilist/src/services/AnilistOAuthService";
import {ANILIST_USER_REPOSITORY, AnilistUserRepository} from "../../entity/repository/AnilistUserRepository";

@Controller("/oauth")
export class OAuthController
{

    @Inject()
    protected readonly anilistOAuthService!: AnilistOAuthService;

    @Inject(ANILIST_USER_REPOSITORY)
    protected readonly anilistUserRepository!: ANILIST_USER_REPOSITORY;

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
        $log.info(`Got an anilist code: ${code}`);

        if(!session.oauth_redirect_next) {
            return "OK";
        }

        session.anilist_token = await this.anilistOAuthService.getToken(code, this.redirectUri);

        $log.info(`Anilist Token: ${session.anilist_token}`);

        const redirectResponse = ctx.response.redirect(302, session.oauth_redirect_next);
        delete session.oauth_redirect_next;

        return redirectResponse;
    }
}