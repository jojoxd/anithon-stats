import { gql, DocumentNode } from "@apollo/client/core";

export { GetUserListsQuery, GetUserListsQueryVariables } from "../generated-types";

export const GetUserLists = gql`	
	query getUserLists($userId: Int!, $mediaType: MediaType!) {
		MediaListCollection(userId: $userId, type: $mediaType) {
			lists {
				name,
				
				entries {
					mediaId
				}
			}
		}
	}
` as DocumentNode;
