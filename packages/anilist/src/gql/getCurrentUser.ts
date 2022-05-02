import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query getCurrentUser {
        Viewer {
            id,
            name,

            avatar {
                large
                medium
            },
        }
    }
` as unknown as DocumentNode;