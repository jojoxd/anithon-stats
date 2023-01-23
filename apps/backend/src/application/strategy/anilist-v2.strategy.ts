import { Strategy } from "passport";
import type { Request as ExpressRequest } from "express";
import fetch from "got-fetch";
import { debug } from "debug";

export interface AnilistV2StrategyOptions
{
	clientId: string;
	clientSecret: string;

	redirectUri: string;

	headers?: Record<string, string>;

	logger?: (message: string) => void;
}

interface AnilistTokenResponse
{
	access_token?: string;
}

type VerifyCallback = (err: any, user: Express.User, info?: object) => void;
type VerifyFn = (req: Express.Request, token: string, callback: VerifyCallback) => void;

export class AnilistV2Strategy extends Strategy
{
	public override name = "anilist";

	protected options: AnilistV2StrategyOptions;

	protected verify: VerifyFn;

	protected log: (message: string) => void;

	protected static readonly AUTHORIZE_ENDPOINT = "https://anilist.co/api/v2/oauth/authorize";

	protected static readonly TOKEN_ENDPOINT = "https://anilist.co/api/v2/oauth/token";

	constructor(
		options: AnilistV2StrategyOptions,
		verify: VerifyFn,
	)
	{
		super();

		this.options = options;
		this.verify = verify;

		this.log = options.logger ?? debug("passport:anilist");
	}

	public override authenticate(req: ExpressRequest): void
	{
		this.log(`Authenticate ${req.id}`);

		if (req.query && req.query.code) {
			this.onCodeReceived(req, req.query.code as string)
				.catch((e) => this.fail(e));

			return;
		}

		this.startAuthorize();
	}

	protected async onCodeReceived(req: ExpressRequest, code: string): Promise<void>
	{
		this.log(`Received code`);

		const accessToken = await this.fetchAccessToken(code);

		if (accessToken === null) {
			return this.fail(new Error("Failed to fetch access token"));
		}

		this.log(`Successfully converted code to token`);

		this.verify(req, accessToken, (err, user, info) => {
			this.log(`Verify callback`);
			console.log({ err, user });

			if (err) {
				return this.fail(err);
			}

			return this.success(user, info);
		});
	}

	protected startAuthorize(): void
	{
		const url = new URL(AnilistV2Strategy.AUTHORIZE_ENDPOINT);
		url.searchParams.append("client_id", this.options.clientId);
		url.searchParams.append("redirect_uri", this.options.redirectUri);
		url.searchParams.append("response_type", "code");

		this.log("Starting authorize");
		this.redirect(url.toString());
	}

	protected async fetchAccessToken(code: string): Promise<string | null>
	{
		const bodyData = {
			grant_type: "authorization_code",
			client_id: this.options.clientId,
			client_secret: this.options.clientSecret,
			redirect_uri: this.options.redirectUri,

			code,
		};

		const response = await fetch(AnilistV2Strategy.TOKEN_ENDPOINT, {
			method: "POST",

			headers: {
				...this.options.headers,

				"Accept": "application/json",
				"Content-Type": "application/json",
			},

			body: JSON.stringify(bodyData),
		});

		this.log(`Auth token response: ${response.status}`);

		const data = await response.json() as AnilistTokenResponse;

		if (response.status > 200 || !data.access_token) {
			return null;
		}

		return data.access_token;
	}
}
