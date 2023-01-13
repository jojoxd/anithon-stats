import { gql, DocumentNode } from "@apollo/client/core";
import {SeriesViewFragment} from "./series-view.fragment.gql";

export { SearchSeriesQuery, SearchSeriesQueryVariables } from "../generated-types";

export const SearchSeries = gql`
	query searchSeries($query: String!, $mediaType: MediaType!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			media(search: $query, type: $mediaType) {
				...SeriesView
			}
		}
	}
	
	${SeriesViewFragment}
` as DocumentNode;
