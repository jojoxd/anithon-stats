import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query getUserLists($username: String!, $type: MediaType!, $statuses: [MediaListStatus!]!) {
        MediaListCollection(userName: $username, type: $type, status_in: $statuses) {
            user {
                id
            }

            lists {
                name,
                entries {
                    id
                    progress
                    media {
                        episodes
                        duration
                    }
                }
            }
        }
    }
` as unknown as DocumentNode;