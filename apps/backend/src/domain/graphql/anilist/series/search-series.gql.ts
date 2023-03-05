import { gql, DocumentNode } from "@apollo/client/core";
import { MediaRelatedFragment } from "../media/media-related.fragment.gql";
import {PageViewFragment} from "../page/page-view.fragment.gql";

export { SearchSeriesQuery, SearchSeriesQueryVariables } from "../generated-types";

export const SearchSeries = gql`
	query searchSeries($query: String!, $mediaType: MediaType!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			...PageView,

			media(search: $query, type: $mediaType) {
				...MediaRelatedFragment
			}
		}
	}
	
	${PageViewFragment}
	${MediaRelatedFragment}
` as DocumentNode;
