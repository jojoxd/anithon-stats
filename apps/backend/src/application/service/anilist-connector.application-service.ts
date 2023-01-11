import {Constant, Inject, Service} from "@tsed/di";
import {AnilistOAuthService} from "@anistats/anilist";
import {Context, PlatformResponse, Session} from "@tsed/common";
import {UserDomainService} from "../../domain/service/user.domain-service";
import {AnilistUserDomainService} from "../../domain/service";

@Service()
export class AnilistConnectorApplicationService
{
	public static readonly CONTROLLER_ROUTE = "/connect/anilist";
	public static readonly INGEST_ROUTE = "/ingest";

	@Constant("EXTERNAL_API_URL")
	protected readonly externalApiUrl!: string;

	@Inject()
	protected readonly anilistOAuthService!: AnilistOAuthService;

	@Inject()
	protected readonly anilistUserService!: AnilistUserDomainService;

	@Inject()
	protected readonly userService!: UserDomainService;

	protected get redirectUri(): string
	{
		return `${this.externalApiUrl}/connect/anilist`;
	}

	async startAuthorize(redirectTo: string, context: Context, session: Session): Promise<PlatformResponse>
	{
		session.anilistConnector ??= {};
		session.anilistConnector.redirectNext = redirectTo;

		session.save();

		return context.response.redirect(
			302,
			this.anilistOAuthService.getAuthorizeUri(`${this.redirectUri}${AnilistConnectorApplicationService.INGEST_ROUTE}`),
		);
	}

	async finishAuthorize(code: string, context: Context, session: Session): Promise<PlatformResponse>
	{
		session.anilistToken = await this.anilistOAuthService.getToken(code, `${this.redirectUri}${AnilistConnectorApplicationService.INGEST_ROUTE}`) ?? undefined;
		const redirectNext = session.anilistConnector?.redirectNext ?? "/";
		delete session.anilistConnector;

		const currentUser = await this.anilistUserService.getCurrentUser();

		const user = await this.userService.onboardAnilistUser(currentUser);

		session.userId = user.id;

		return context.response.redirect(302, redirectNext);
	}
}
