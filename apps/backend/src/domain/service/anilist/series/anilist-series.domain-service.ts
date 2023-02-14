import {AnilistDomainService} from "../anilist.domain-service";
import {Injectable, ProviderScope} from "@tsed/di";
import {AnilistSeriesView} from "../../../view/anilist/series/anilist-series.view";
import {InternalServerError} from "@tsed/exceptions";
import {MediaType} from "../../../graphql/anilist/generated-types";
import {$log} from "@tsed/common";

import {
	BatchGetSeries,
	BatchGetSeriesQuery,
	BatchGetSeriesQueryVariables,
	GetSeries,
	GetSeriesQuery,
	GetSeriesQueryVariables,
	SearchSeries,
	SearchSeriesQuery,
	SearchSeriesQueryVariables
} from "../../../graphql/anilist/series";
import {AnilistSeriesId} from "@anistats/shared";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistSeriesDomainService extends AnilistDomainService
{
	async getSeries(seriesId: any): Promise<AnilistSeriesView>
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
		return new AnilistSeriesView(data.Media!);
	}

	async batchGetSeries(seriesIds: AnilistSeriesId[], withRelated: boolean = true, mediaType: MediaType = MediaType.Anime): Promise<Map<AnilistSeriesId, AnilistSeriesView>>
	{
		// short-circuit
		if (seriesIds.length === 0) {
			return new Map();
		}

		const endHistogram = this.metrics.startHistogram("BatchGetSeries", "QUERY");

		console.log(`[AL] batchGetSeries(${seriesIds.join(', ')}, withRelated: ${withRelated ? 'true' : 'false'})`);

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

		return data.Page!.media!.reduce((acc, media) => {
			acc.set(media!.id, new AnilistSeriesView(media!));

			if (withRelated) {
				for(const edge of media!.relations!.edges ?? []) {
					if (edge!.node!.type! === mediaType) {
						acc.set(edge!.node!.id as AnilistSeriesId, new AnilistSeriesView(edge!.node!));
					}
				}
			}

			return acc;
		}, new Map());
	}

	async searchSeries(query: string, mediaType: MediaType = MediaType.Anime, page: number = 1): Promise<Array<AnilistSeriesView> | null>
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

		return data.Page?.media?.map((media) => new AnilistSeriesView(media!)) ?? null;
	}
}
