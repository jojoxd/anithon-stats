import { gql, DocumentNode } from "@apollo/client/core";
import { PageViewFragment } from "../page/page-view.fragment.gql";
import {MediaRelatedFragment} from "../media/media-related.fragment.gql";

export { BatchGetSeriesQuery, BatchGetSeriesQueryVariables } from "../generated-types";

export const BatchGetSeries = gql`
	query batchGetSeries($mediaIds: [Int!]!, $mediaType: MediaType!, $perPage: Int!) {
		Page(page: 1, perPage: $perPage) {
			...PageView,

			media(id_in: $mediaIds, type: $mediaType) {
				...MediaRelatedFragment,
			}
		}
	}

	${PageViewFragment}
	${MediaRelatedFragment}
` as DocumentNode;
