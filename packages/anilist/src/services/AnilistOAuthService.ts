/**
 * Helper for anilist OAuth
 */
import { $log } from "@tsed/common";
import {Constant} from "@tsed/di";
import fetch from "node-fetch";


export class AnilistOAuthService
{
    @Constant("ANILIST_CLIENT_ID")
    protected readonly clientId!: string;

    @Constant("ANILIST_CLIENT_SECRET")
    protected readonly clientSecret!: string;

    getAuthorizeUri(externalUri: string): string
    {
        const sp = new URLSearchParams();
        sp.append("client_id", this.clientId);
        sp.append("redirect_uri", externalUri);
        sp.append("response_type", "code");

        return `https://anilist.co/api/v2/oauth/authorize?${sp.toString()}`;
    }

    async getToken(code: string, externalUri: string): Promise<string | null>
    {
        const response = await fetch("https://anilist.co/api/v2/oauth/token", {
            method: "POST",

            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
            },

            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: externalUri,

                code,
            }),
        });

        $log.info(`Anilist Token Response: ${response.status}`);

        const jsonResponse = await response.json() as { access_token?: string };

        if(response.status > 200) {
            $log.warn(jsonResponse);

            return null;
        }

        if(!jsonResponse.access_token)
            return null;

        return jsonResponse.access_token;
    }
}