import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query searchUserByName($name: String!) {
        User(name: $name) {
            id,
            name,

            avatar {
                large
                medium
            },
        }
    }
` as unknown as DocumentNode;