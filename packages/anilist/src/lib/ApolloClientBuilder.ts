"use strict";

import {ApolloClient, InMemoryCache, ApolloLink, HttpLink} from "apollo-boost";
import {ApolloCache} from "apollo-cache";
import fetch from "node-fetch";

export class ApolloClientBuilder
{
    protected cache: ApolloCache<any> | null = null;
    protected link: ApolloLink | null = null;

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

    build(): ApolloClient<any> | never {
        if (this.link === null)
            throw new Error("No Link Specified");

        if (this.cache === null)
            this.withMemoryCache();

        return new ApolloClient({
            cache: this.cache!,
            link: this.link,
        });
    }
}