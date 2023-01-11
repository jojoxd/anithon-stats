import {ApolloClient} from "@apollo/client/core";
import {Injectable, InjectContext, ProviderScope} from "@tsed/di";
import {Context} from "@tsed/common";
import {ApolloClientBuilder} from "../../util/apollo-client-builder";

@Injectable({ scope: ProviderScope.REQUEST })
export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	private static readonly GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

	@InjectContext()
	private context?: Context;

	constructor() {
		const builder = new ApolloClientBuilder(AnilistDomainService.GRAPHQL_ENDPOINT);

		this.client = builder
			.withAuth(() => this.bearerToken)
			.withMemoryCache()
			.build();
	}

	private get bearerToken(): string | null
	{
		return this.context?.getRequest?.()?.session?.anilistToken ?? null;
	}
}
