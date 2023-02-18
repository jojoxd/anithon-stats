import {ApolloClient} from "@apollo/client/core";
import { Context } from "@tsed/common";
import {Constant, Inject, Injectable, InjectContext, ProviderScope} from "@tsed/di";
import {ApolloClientBuilder} from "../../util/apollo-client-builder";
import {AnilistMetricsDomainService} from "../metrics/anilist-metrics.domain-service";
import {AnilistConfiguration} from "../../interface/anilist-configuration.interface";

@Injectable({ scope: ProviderScope.REQUEST })
export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	private static readonly GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

	@Constant('version')
	protected readonly appVersion!: string;

	@Constant('anilist')
	protected readonly configuration!: AnilistConfiguration;

	@InjectContext()
	protected readonly context!: Context;

	@Inject()
	protected readonly metrics!: AnilistMetricsDomainService;

	constructor() {
		const builder = new ApolloClientBuilder();

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

	protected get safeMode(): boolean
	{
		return this.configuration.safeMode ?? false;
	}

	private get bearerToken(): string | null
	{
		return this.context?.getRequest?.()?.user?.anilistToken ?? null;
	}
}
