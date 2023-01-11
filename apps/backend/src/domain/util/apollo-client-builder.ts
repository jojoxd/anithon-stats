"use strict";

import fetch from "node-fetch";
import {$log} from "@tsed/common";
import {ApolloCache, ApolloLink, InMemoryCache, NextLink, Operation, ApolloClient, HttpLink} from "@apollo/client/core";
import {onError} from "@apollo/client/link/error";

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

	withAuth(getBearer: () => string | null): this
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

		return this;
	}

	protected get interceptorLink(): ApolloLink
	{
		return new ApolloLink((operation: Operation, forward: NextLink): any => {
			$log.info(`GQL REQUEST "${operation.operationName}"`);

			const response = forward(operation);

			$log.info(`GQL REQUEST COMPLETE "${operation.operationName}"`);

			return response;
		});
	}

	build(): ApolloClient<any> | never {
		if (this.link === null)
			throw new Error("No Link Specified");

		if (this.cache === null)
			this.withMemoryCache();

		let link: ApolloLink = this.interceptorLink.concat(this.link);

		if(this.authLink) {
			link = this.authLink.concat(link);
		}

		link = onError(({ graphQLErrors, networkError, forward, operation, response }) => {
			$log.error(graphQLErrors ?? networkError);
		}).concat(link);

		return new ApolloClient({
			cache: this.cache!,
			link,

			defaultOptions: {
				query: {
					errorPolicy: "ignore",
				},
			},
		});
	}
}
