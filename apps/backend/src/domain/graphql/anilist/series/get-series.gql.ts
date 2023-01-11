import { gql, DocumentNode } from "@apollo/client/core";
import seriesDataFragment from "../fragments/series-data.gql";

export { GetSeriesQuery, GetSeriesQueryVariables } from "../generated-types";

export const GetSeries = gql`
	query getSeries($mediaId: Int!) {
		Media(id: $mediaId) {
			...seriesDataFragment
		}
	}
	
	${seriesDataFragment}
` as DocumentNode;
