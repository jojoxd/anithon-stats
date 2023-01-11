import {AnilistDomainService} from "../anilist.domain-service";
import {Injectable, ProviderScope} from "@tsed/di";
import {AnilistSeriesView} from "../../../view/anilist/series/anilist-series.view";
import {InternalServerError} from "@tsed/exceptions";

import {
	GetSeries,
	GetSeriesQuery,
	GetSeriesQueryVariables
} from "../../../graphql/anilist/series/get-series.gql";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistSeriesDomainService extends AnilistDomainService
{
	async getSeries(seriesId: any): Promise<AnilistSeriesView>
	{
		const { data, errors } = await this.client.query<GetSeriesQuery, GetSeriesQueryVariables>({
			query: GetSeries,
			variables: {
				mediaId: seriesId
			},
		});

		if (errors) {
			throw new InternalServerError(`Failed to fetch series ${seriesId} from anilist`, errors);
		}

		return new AnilistSeriesView(data.Media!);
	}
}
