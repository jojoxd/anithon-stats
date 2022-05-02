"use strict";

import {ApolloClient, InMemoryCache, ApolloLink, HttpLink, Operation, NextLink} from "apollo-boost";
import {ApolloCache} from "apollo-cache";
import fetch from "node-fetch";

export class ApolloClientBuilder
{
    protected cache: ApolloCache<any> | null = null;
    protected link: ApolloLink | null = null;
    protected authLink: ApolloLink | null = null;

    constructor(uri?: string, cache?: any) {
        if (typeof uri !== "undefined")
            this.withUri(uri);

        if (typeof cache !== "undefined")
            this.withCache(cache);
    }

    withCache<TCache>(cache: ApolloCache<TCache>): this {
        this.cache = cache;

        return this;
    }

    withMemoryCache(): this {
        this.withCache(new InMemoryCache());

        return this;
    }

    withUri(uri: string): this {
        this.link = new HttpLink({
            uri,

            // @ts-ignore TS-2322 Different implementations, but are compatible
            fetch
        });

        return this;
    }

    withAuth(getBearer: () => string | null)
    {
        this.authLink = new ApolloLink((operation: Operation, forward: NextLink): any => {
            const bearerToken = getBearer();

            if(bearerToken !== null) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${getBearer()}`
                    }
                });
            }

            return forward(operation);
        });
    }

    build(): ApolloClient<any> | never {
        if (this.link === null)
            throw new Error("No Link Specified");

        if (this.cache === null)
            this.withMemoryCache();

        let link: ApolloLink = this.link;

        if(this.authLink) {
            link = this.authLink.concat(this.link);
        }

        return new ApolloClient({
            cache: this.cache!,
            link,
        });
    }
}