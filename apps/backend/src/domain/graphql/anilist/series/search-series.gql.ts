import { gql, DocumentNode } from "@apollo/client/core";
import {PageViewFragment} from "../page/page-view.fragment.gql";
import {SeriesViewRelatedFragment} from "./series-view-related.fragment.gql";

export { SearchSeriesQuery, SearchSeriesQueryVariables } from "../generated-types";

export const SearchSeries = gql`
	query searchSeries($query: String!, $mediaType: MediaType!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			...PageView,

			media(search: $query, type: $mediaType) {
				...SeriesViewRelated
			}
		}
	}
	
	${PageViewFragment}
	${SeriesViewRelatedFragment}
` as DocumentNode;
