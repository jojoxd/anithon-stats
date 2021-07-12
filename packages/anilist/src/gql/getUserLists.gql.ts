import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query userLists($username: String!, $type: MediaType!, $statuses: [MediaListStatus!]!) {
        MediaListCollection(userName: $username, type: $type, status_in:$statuses) {
            user {
                id
            }

            lists {
                name,
                entries {
                    id
                }
            }
        }
    }
` as unknown as DocumentNode;