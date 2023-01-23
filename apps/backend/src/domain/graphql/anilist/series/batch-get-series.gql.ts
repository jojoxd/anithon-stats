import { gql, DocumentNode } from "@apollo/client/core";
import { SeriesViewFragment } from "./series-view.fragment.gql";
import { PageViewFragment } from "../page/page-view.fragment.gql";

export { BatchGetSeriesQuery, BatchGetSeriesQueryVariables } from "../generated-types";

export const BatchGetSeries = gql`
	query batchGetSeries($mediaIds: [Int!]!, $mediaType: MediaType!, $perPage: Int!) {
		Page(page: 1, perPage: $perPage) {
			...PageView,

			media(id_in: $mediaIds, type: $mediaType) {
				...SeriesView,

				relations {
					edges {
						node {
							...SeriesView,
						}
					}
				}
			}
		}
	}

	${PageViewFragment}
	${SeriesViewFragment}
` as DocumentNode;
