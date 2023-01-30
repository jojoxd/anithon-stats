import {ApolloClient} from "@apollo/client/core";
import { Context } from "@tsed/common";
import {Constant, Injectable, InjectContext, ProviderScope} from "@tsed/di";
import {ApolloClientBuilder} from "../../util/apollo-client-builder";

@Injectable({ scope: ProviderScope.REQUEST })
export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	private static readonly GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

	@Constant('version')
	protected readonly appVersion!: string;

	@InjectContext()
	protected readonly context!: Context;

	constructor() {
		const builder = new ApolloClientBuilder();

		console.log('UA', `AniStats/${this.appVersion} (got; got-fetch; ${this.constructor.name}; +https://gitlab.jojoxd.nl/jojoxd/anithon-stats)`);

		this.client = builder
			.withUri(AnilistDomainService.GRAPHQL_ENDPOINT, {
				headers: {
					'User-Agent': `AniStats/${this.appVersion} (got; got-fetch; ${this.constructor.name}; +https://gitlab.jojoxd.nl/jojoxd/anithon-stats)`
				},
			})
			.withAuth(() => this.bearerToken)
			.withMemoryCache()
			.build();
	}

	private get bearerToken(): string | null
	{
		return this.context?.getRequest?.()?.user?.anilistToken ?? null;
	}
}
