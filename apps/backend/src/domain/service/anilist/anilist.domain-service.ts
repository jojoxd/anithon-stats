import {ApolloClient} from "@apollo/client/core";
import {Injectable, ProviderScope} from "@tsed/di";
import {ApolloClientBuilder} from "../../util/apollo-client-builder";
import {InjectSession, Session} from "../../decorator/inject-session.decorator";

@Injectable({ scope: ProviderScope.REQUEST })
export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	private static readonly GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

	@InjectSession()
	protected session?: Session;

	constructor() {
		const builder = new ApolloClientBuilder(AnilistDomainService.GRAPHQL_ENDPOINT);

		this.client = builder
			.withAuth(() => this.bearerToken)
			.withMemoryCache()
			.build();
	}

	private get bearerToken(): string | null
	{
		return this.session?.anilistToken ?? null;
	}
}
