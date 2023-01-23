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

	async batchGetSeries(seriesIds: AnilistSeriesId[], withRelated: boolean = true, mediaType: MediaType = MediaType.Anime): Promise<Map<AnilistSeriesId, AnilistSeriesView>>
	{
		// short-circuit
		if (seriesIds.length === 0) {
			return new Map();
		}

		console.log(`[AL] batchGetSeries(${seriesIds.join(', ')}, withRelated: ${withRelated ? 'true' : 'false'})`);

		const { data, errors } = await this.client.query<BatchGetSeriesQuery, BatchGetSeriesQueryVariables>({
			query: BatchGetSeries,

			variables: {
				mediaIds: seriesIds,
				perPage: seriesIds.length,
				mediaType,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		if (errors) {
			$log.error(`[AL] Failed to batchGetSeries(${seriesIds.join(', ')})`);

			throw new InternalServerError(`Failed to get multiple series`, errors);
		}

		return seriesIds.reduce((acc, seriesId) => {
			const media = data.Page!.media!.find((media) => media!.id === seriesId) ?? null;

			// NOTE: We are trashing the unknown series here
			if (media !== null) {
				acc.set(seriesId, new AnilistSeriesView(media));

				if (withRelated) {
					for(const edge of media!.relations!.edges ?? []) {
						acc.set(edge!.node!.id as AnilistSeriesId, new AnilistSeriesView(edge!.node!));
					}
				}
			}

			return acc;
		}, new Map<AnilistSeriesId, AnilistSeriesView>());
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
