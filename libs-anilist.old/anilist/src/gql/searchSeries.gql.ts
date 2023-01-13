import {DocumentNode} from "graphql";
import gql from "graphql-tag";
import SeriesDataFragment from "./fragments/SeriesDataFragment.gql";

export default gql`
    query searchSeries($query: String!, $type: MediaType!) {
        Page(page: 0, perPage: 10) {
            media(search: $query, type: $type) {
                ...SeriesData,
            }
        }
    }
    
    ${SeriesDataFragment}
` as unknown as DocumentNode;