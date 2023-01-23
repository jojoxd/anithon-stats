import { gql, DocumentNode } from "@apollo/client/core";
import {SeriesViewFragment} from "../series/series-view.fragment.gql";

export { GetUserListsQuery, GetUserListsQueryVariables } from "../generated-types";

export const GetUserLists = gql`	
	query getUserLists($userId: Int!, $mediaType: MediaType!) {
		MediaListCollection(userId: $userId, type: $mediaType) {
			lists {
				name,
				
				entries {
					media {
						...SeriesView
					}
				}
			}
		}
	}
	
	${SeriesViewFragment}
` as DocumentNode;
