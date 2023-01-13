import { gql, DocumentNode } from "@apollo/client/core";
import { SeriesViewFragment } from "./series-view.fragment.gql";

export { GetSeriesQuery, GetSeriesQueryVariables } from "../generated-types";

export const GetSeries = gql`
	query getSeries($mediaId: Int!) {
		Media(id: $mediaId) {
			...SeriesView
		}
	}
	
	${SeriesViewFragment}
` as DocumentNode;
