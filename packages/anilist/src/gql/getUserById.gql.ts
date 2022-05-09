import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query getUserById($userId: Int!) {
        User(id: $userId) {
            id,
            name,

            avatar {
                large
                medium
            },
        }
    }
` as unknown as DocumentNode;