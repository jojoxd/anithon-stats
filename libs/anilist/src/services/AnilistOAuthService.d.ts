export declare class AnilistOAuthService {
    protected readonly clientId: string;
    protected readonly clientSecret: string;
    getAuthorizeUri(externalUri: string): string;
    getToken(code: string, externalUri: string): Promise<string | null>;
}
//# sourceMappingURL=AnilistOAuthService.d.ts.map