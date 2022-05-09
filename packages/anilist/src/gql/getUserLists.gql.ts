import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query getUserLists($userId: Int!, $type: MediaType!, $statuses: [MediaListStatus!]!) {
        MediaListCollection(userId: $userId, type: $type, status_in: $statuses) {
            user {
                id
            }

            lists {
                name,
                entries {
                    id
                    progress
                    media {
                        id,
                        episodes
                        duration
                    }
                }
            }
        }
    }
` as unknown as DocumentNode;