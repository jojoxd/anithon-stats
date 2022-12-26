"use strict";

import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";
import SeriesDataFragment from "./fragments/SeriesDataFragment.gql";

export default gql`
    query fetchUserLists($userId: Int!, $type: MediaType!, $statuses: [MediaListStatus!]!) {
        MediaListCollection(userId: $userId, type: $type, status_in:$statuses) {
            user {
                id
            }

            lists {
                name
                entries {
                    id
                    status
                    notes
                    progress

                    startedAt {
                        year
                        month
                        day
                    }

                    completedAt {
                        year
                        month
                        day
                    }

                    media {
                        ...SeriesData
                    }
                }
            }
        }
    }
    
    ${SeriesDataFragment}
` as unknown as DocumentNode;