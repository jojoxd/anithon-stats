import { gql, DocumentNode } from "@apollo/client/core";

export { GetCustomListsContainingQuery, GetCustomListsContainingQueryVariables } from "../generated-types";

export const GetCustomListsContaining = gql`
	query getCustomListsContaining($mediaId: Int!, $userId: Int!) {
		MediaList(mediaId: $mediaId, userId: $userId) {
			customLists(asArray: true)
		}
	}
` as DocumentNode;
