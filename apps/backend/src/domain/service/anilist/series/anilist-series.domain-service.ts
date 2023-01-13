import {AnilistDomainService} from "../anilist.domain-service";
import {Injectable, ProviderScope} from "@tsed/di";
import {AnilistSeriesView} from "../../../view/anilist/series/anilist-series.view";
import {InternalServerError} from "@tsed/exceptions";
import {MediaType} from "../../../graphql/anilist/generated-types";
import { $log } from "@tsed/common";

import {
	SearchSeries,
	SearchSeriesQuery, SearchSeriesQueryVariables,

	GetSeries,
	GetSeriesQuery, GetSeriesQueryVariables,
} from "../../../graphql/anilist/series";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistSeriesDomainService extends AnilistDomainService
{
	/**
	 * @deprecated TODO: Make a bulk version of this API
	 */
	async getSeries(seriesId: any): Promise<AnilistSeriesView>
	{
		console.log(`[AL] getSeries(${seriesId})`);

		const { data, errors } = await this.client.query<GetSeriesQuery, GetSeriesQueryVariables>({
			query: GetSeries,
			variables: {
				mediaId: seriesId,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		if (errors) {
			$log.error(`[AL] Failed to getSeries(${seriesId})`);
			throw new InternalServerError(`Failed to fetch series ${seriesId} from anilist`, errors);
		}

		return new AnilistSeriesView(data.Media!);
	}

	async searchSeries(query: string, mediaType: MediaType = MediaType.Anime, page: number = 1): Promise<Array<AnilistSeriesView> | null>
	{
		const { data, errors } = await this.client.query<SearchSeriesQuery, SearchSeriesQueryVariables>({
			query: SearchSeries,
			variables: {
				query,
				mediaType,
				page,
				perPage: 10,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		if (errors) {
			throw new InternalServerError(`Failed to search series (${mediaType}) "${query}" from anilist`, errors);
		}

		return data.Page?.media?.map((media) => new AnilistSeriesView(media!)) ?? null;
	}
}
