import { gql, DocumentNode } from "@apollo/client/core";
import { PageViewFragment } from "../page/page-view.fragment.gql";
import {SeriesViewRelatedFragment} from "./series-view-related.fragment.gql";

export { BatchGetSeriesQuery, BatchGetSeriesQueryVariables } from "../generated-types";

export const BatchGetSeries = gql`
	query batchGetSeries($mediaIds: [Int!]!, $mediaType: MediaType!, $perPage: Int!) {
		Page(page: 1, perPage: $perPage) {
			...PageView,

			media(id_in: $mediaIds, type: $mediaType) {
				...SeriesViewRelated,
			}
		}
	}

	${PageViewFragment}
	${SeriesViewRelatedFragment}
` as DocumentNode;
