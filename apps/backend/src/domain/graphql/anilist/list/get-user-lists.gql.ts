import { gql, DocumentNode } from "@apollo/client/core";
import {SeriesViewRelatedFragment} from "../series/series-view-related.fragment.gql";

export { GetUserListsQuery, GetUserListsQueryVariables } from "../generated-types";

export const GetUserLists = gql`	
	query getUserLists($userId: Int!, $mediaType: MediaType!) {
		MediaListCollection(userId: $userId, type: $mediaType) {
			lists {
				name,
				
				entries {
					media {
						...SeriesViewRelated
					}
				}
			}
		}
	}
	
	${SeriesViewRelatedFragment}
` as DocumentNode;
