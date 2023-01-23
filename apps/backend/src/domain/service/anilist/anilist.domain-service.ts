import {ApolloClient, QueryOptions} from "@apollo/client/core";
import {Constant, Injectable, ProviderScope} from "@tsed/di";
import {ApolloClientBuilder} from "../../util/apollo-client-builder";
import {InjectSession, Session} from "@jojoxd/tsed-util/express-session";
import {Page} from "../../graphql/anilist/generated-types";

@Injectable({ scope: ProviderScope.REQUEST })
export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	private static readonly GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

	@Constant('version')
	protected readonly appVersion!: string;

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
		return null; // @TODO: Get token from req.user.anilistToken;
		// return this.session?.anilistToken ?? null;
	}
}
