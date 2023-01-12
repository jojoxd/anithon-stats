import { gql, DocumentNode } from "@apollo/client/core";
import seriesDataFragment from "../fragments/series-data.gql";

export { SearchSeriesQuery, SearchSeriesQueryVariables } from "../generated-types";

export const SearchSeries = gql`
	query searchSeries($query: String!, $mediaType: MediaType!, $page: Int!, $perPage: Int!) {
		Page(page: $page, perPage: $perPage) {
			media(search: $query, type: $mediaType) {
				...seriesDataFragment
			}
		}
	}
	
	${seriesDataFragment}
` as DocumentNode;
