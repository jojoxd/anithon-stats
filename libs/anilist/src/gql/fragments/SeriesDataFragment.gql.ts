import gql from "graphql-tag";
import { DocumentNode } from "graphql";

export default gql`
    fragment SeriesData on Media {
        id
        status
        format
        episodes
        duration
        description

        coverImage {
            large
        }

        startDate {
            year
            month
            day
        }

        endDate {
            year
            month
            day
        }

        title {
            romaji
            english
            native
        }

        relations {
            edges {
                relationType
                node {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                }
            }
        }
    }
` as unknown as DocumentNode;