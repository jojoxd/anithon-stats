import {Constant, Inject, Service} from "@tsed/di";
import {AnilistOAuthService} from "@anistats/anilist";
import {Context, PlatformResponse, Session} from "@tsed/common";
import {UserDomainService} from "../../domain/service/user.domain-service";

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
		session.anilistToken = await this.anilistOAuthService.getToken(code, this.redirectUri) ?? undefined;
		const redirectNext = session.anilistConnector?.redirectNext ?? "/";
		delete session.anilistConnector;

		// @TODO: Fetch current user using anilist API
		const anilistUser = {
			id: 141428,
		};

		const user = this.userService.onboardAnilistUser(anilistUser.id);

		return context.response.redirect(302, redirectNext);
	}
}
