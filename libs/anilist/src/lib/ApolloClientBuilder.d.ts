import { ApolloClient, ApolloLink } from "apollo-boost";
import { ApolloCache } from "apollo-cache";
export declare class ApolloClientBuilder {
    protected cache: ApolloCache<any> | null;
    protected link: ApolloLink | null;
    protected authLink: ApolloLink | null;
    constructor(uri?: string, cache?: any);
    withCache<TCache>(cache: ApolloCache<TCache>): this;
    withMemoryCache(): this;
    withUri(uri: string): this;
    withAuth(getBearer: () => string | null): void;
    protected get interceptorLink(): ApolloLink;
    build(): ApolloClient<any> | never;
}
//# sourceMappingURL=ApolloClientBuilder.d.ts.map