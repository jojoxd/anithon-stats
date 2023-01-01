import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`    
    mutation addEntryToList($listNames: [String!]!, $mediaId: Int!) {
        SaveMediaListEntry(mediaId: $mediaId, customLists: $listNames) {
            id
        }
    }
` as unknown as DocumentNode;