import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query getListsContainingMediaId($mediaId: Int!, $userId: Int!) {
        MediaList(mediaId:$mediaId, userId: $userId) {
            customLists(asArray:true)
        }
    }
` as unknown as DocumentNode;
