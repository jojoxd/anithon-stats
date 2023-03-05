import { gql, DocumentNode } from "@apollo/client/core";
import { MediaFragment } from "../media/media.fragment.gql";

export { GetSeriesQuery, GetSeriesQueryVariables } from "../generated-types";

export const GetSeries = gql`
	query getSeries($mediaId: Int!) {
		Media(id: $mediaId) {
			...MediaFragment
		}
	}
	
	${MediaFragment}
` as DocumentNode;
