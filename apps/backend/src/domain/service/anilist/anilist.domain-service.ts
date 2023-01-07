import {ApolloClient, InMemoryCache} from "@apollo/client";
import {Constant} from "@tsed/di";

export abstract class AnilistDomainService
{
	protected readonly client: ApolloClient<any>;

	@Constant("ANILIST_API_URI")
	protected readonly anilistApiUri!: string;

	constructor() {
		this.client = new ApolloClient<any>({
			uri: this.anilistApiUri,
			cache: new InMemoryCache(),
		});
	}
}
