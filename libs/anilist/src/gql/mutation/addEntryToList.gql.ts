import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`    
    mutation addEntryToList($listName: String!, $mediaId: Int!) {
        SaveMediaListEntry(mediaId: $mediaId, status: PLANNING, customLists: [$listName]) {
            id
        }
    }
` as unknown as DocumentNode;