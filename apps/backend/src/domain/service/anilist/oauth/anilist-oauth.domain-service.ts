import {$log, Service} from "@tsed/common";
import {Constant} from "@tsed/di";
import fetch from "node-fetch";

@Service()
export class AnilistOAuthDomainService
{
	@Constant("ANILIST_CLIENT_ID")
	protected readonly clientId!: string;

	@Constant("ANILIST_CLIENT_SECRET")
	protected readonly clientSecret!: string;

	protected static readonly TOKEN_ENDPOINT = "https://anilist.co/api/v2/oauth/token";

	protected static readonly AUTHORIZE_ENDPOINT = "https://anilist.co/api/v2/oauth/authorize";

	/**
	 * Gets the Authorize URL
	 *
	 * Used to redirect our URL to anilist to get an authorization code
	 */
	public getAuthorizeUri(redirectUri: string): string
	{
		const url = new URL(AnilistOAuthDomainService.AUTHORIZE_ENDPOINT);

		url.searchParams.append("client_id", this.clientId);
		url.searchParams.append("redirect_uri", redirectUri);
		url.searchParams.append("response_type", "code");

		return url.toString();
	}

	/**
	 * Gets the Access Token from Anilist using the code we got from getAuthorizeUri()
	 */
	public async getAccessToken(code: string, redirectUri: string): Promise<string | null>
	{
		// @TODO: Migrate to axios
		const response = await fetch(AnilistOAuthDomainService.TOKEN_ENDPOINT, {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},

			body: JSON.stringify({
				grant_type: "authorization_code",
				client_id: this.clientId,
				client_secret: this.clientSecret,
				redirect_uri: redirectUri,

				code,
			}),
		});

		$log.info(`[AL] Auth Token Response: ${response.status}`);

		const jsonResponse = await response.json() as { access_token?: string };

		if(response.status > 200) {
			$log.warn(`[AL] Failed to get Auth Token`, jsonResponse);

			return null;
		}

		if (!jsonResponse.access_token) {
			$log.warn(`[AL] Failed to get Auth Token: Access token not provided by anilist API`);

			return null;
		}

		return jsonResponse.access_token;
	}
}
