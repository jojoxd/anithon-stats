import { gql, DocumentNode } from "@apollo/client/core";

export { SetEntryForCustomListsMutation, SetEntryForCustomListsMutationVariables } from "../../generated-types";

export const SetEntryForCustomLists = gql`
	mutation setEntryForCustomLists($mediaId: Int!, $listNames: [String!]!) {
		SaveMediaListEntry(mediaId: $mediaId, customLists: $listNames) {
			id
		}
	}
` as DocumentNode;
