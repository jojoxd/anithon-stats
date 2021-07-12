"use strict";

import {gql} from "apollo-boost";
import {DocumentNode} from "graphql";

export default gql`
    query userLists($username: String!, $type: MediaType!, $statuses: [MediaListStatus!]!) {
        MediaListCollection(userName: $username, type: $type, status_in:$statuses) {
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
                        id
                        status
                        format
                        episodes
                        duration

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
                }
            }
        }
    }
` as unknown as DocumentNode;