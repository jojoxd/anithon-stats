import { gql, DocumentNode } from "@apollo/client/core";
import {GetUserListsQuery, GetUserListsQueryVariables} from "../generated-types";
import {MediaRelatedFragment} from "../media/media-related.fragment.gql";

const GetUserLists = gql`
	query getUserLists($userId: Int!, $mediaType: MediaType!) {
		MediaListCollection(userId: $userId, type: $mediaType) {
			lists {
				name,
				
				entries {
					id,
					status,
					progress,

					media {
						...MediaRelatedFragment
					}
				}
			}
		}
	}
	
	${MediaRelatedFragment}
` as DocumentNode;

type MediaListCollection = NonNullable<GetUserListsQuery['MediaListCollection']>;
type MediaListGroup = NonNullable<NonNullable<MediaListCollection['lists']>[number]>;
type MediaListGroupEntry = NonNullable<NonNullable<MediaListGroup['entries']>[number]>;

export {
	GetUserLists,
	type GetUserListsQuery,
	type GetUserListsQueryVariables,

	type MediaListCollection,
	type MediaListGroup,
	type MediaListGroupEntry,
};
