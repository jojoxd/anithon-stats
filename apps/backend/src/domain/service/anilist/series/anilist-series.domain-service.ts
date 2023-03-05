import {AnilistDomainService} from "../anilist.domain-service";
import {Injectable, ProviderScope} from "@tsed/di";
import {InternalServerError} from "@tsed/exceptions";
import {MediaType} from "../../../graphql/anilist/generated-types";
import {$log} from "@tsed/common";
import { MediaFragmentView } from "../../../view/anilist/media/media-fragment.view";
import { MediaRelatedFragmentView } from "../../../view/anilist/media/media-related-fragment.view";
import { AnilistMediaId } from "@anistats/shared";

import {
	BatchGetSeries,
	BatchGetSeriesQuery, BatchGetSeriesQueryVariables,
} from "../../../graphql/anilist/series/batch-get-series.gql";
import {
	GetSeries,
	GetSeriesQuery, GetSeriesQueryVariables,
} from "../../../graphql/anilist/series/get-series.gql";

import {
	SearchSeries,
	SearchSeriesQuery, SearchSeriesQueryVariables
} from "../../../graphql/anilist/series/search-series.gql";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistSeriesDomainService extends AnilistDomainService
{
	async getSeries(seriesId: any): Promise<MediaFragmentView>
	{
		const endHistogram = this.metrics.startHistogram("GetSeries", "QUERY");

		console.log(`[AL] getSeries(${seriesId})`);

		const { data, errors, error, } = await this.client.query<GetSeriesQuery, GetSeriesQueryVariables>({
			query: GetSeries,
			variables: {
				mediaId: seriesId,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.error(`[AL] Failed to getSeries(${seriesId})`);
			throw new InternalServerError(`Failed to fetch series ${seriesId} from anilist`, errors);
		}
		return new MediaFragmentView(data.Media!);
	}

	async batchGetSeries(seriesIds: Array<AnilistMediaId>, mediaType: MediaType = MediaType.Anime): Promise<Array<MediaRelatedFragmentView>>
	{
		// short-circuit
		if (seriesIds.length === 0) {
			return [];
		}

		const endHistogram = this.metrics.startHistogram("BatchGetSeries", "QUERY");

		console.log(`[AL] batchGetSeries(${seriesIds.join(', ')})`);

		const { data, errors, error, } = await this.client.query<BatchGetSeriesQuery, BatchGetSeriesQueryVariables>({
			query: BatchGetSeries,

			variables: {
				mediaIds: seriesIds,
				perPage: seriesIds.length,
				mediaType,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.error(`[AL] Failed to batchGetSeries(${seriesIds.join(', ')})`);
			throw new InternalServerError(`Failed to get multiple series`, errors);
		}

		return data.Page!.media!.map((media) => {
			return new MediaRelatedFragmentView(media!);
		});
	}

	async searchSeries(query: string, mediaType: MediaType = MediaType.Anime, page: number = 1): Promise<Array<MediaFragmentView> | null>
	{
		const endHistogram = this.metrics.startHistogram("SearchSeries", "QUERY");

		const { data, errors, error, } = await this.client.query<SearchSeriesQuery, SearchSeriesQueryVariables>({
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

		endHistogram(error?.name);
		if (errors) {
			throw new InternalServerError(`Failed to search series (${mediaType}) "${query}" from anilist`, errors);
		}

		return data.Page?.media?.map((media) => new MediaFragmentView(media!)) ?? null;
	}
}
