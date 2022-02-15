"use strict";

import {Service} from "@tsed/di";
import {IAnilistApi} from "./IAnilistApi";
import {ApolloClient} from "apollo-boost";
import {ApolloClientBuilder} from "../lib/ApolloClientBuilder";
import getUserLists from "../gql/getUserLists.gql";
import fetchUserLists from "../gql/fetchUserLists.gql";
import {
    MediaListStatus,
    MediaType,
    userLists,
    userLists_MediaListCollection_lists,
    userListsVariables
} from "../..";
import {GraphQLError} from "graphql";
import {$log, UseCache} from "@tsed/common";

@Service()
export class AnilistService implements IAnilistApi
{
    public static readonly ENDPOINT = "https://graphql.anilist.co";

    protected apollo: ApolloClient<any>;

    constructor()
    {
        // Setup Apollo Client
        const builder = new ApolloClientBuilder(AnilistService.ENDPOINT);

        this.apollo = builder.build();
    }

    @UseCache({ ttl: 30 })
    async fetchUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<userLists> | never
    {
        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        // Fetch Data
        const data = await this.apollo.query<userLists, userListsVariables>({
            query: fetchUserLists,
            variables: { username, type, statuses },
            fetchPolicy: "network-only",
        });

        // Error Handling @TODO: Throw AnilistError() instead of Error()
        if (data.errors)
            throw new Error(data.errors.map((e: GraphQLError) => `GraphQLError/${e.name}: ${e.message}`).join("\n"));

        // @DEBUG
        const len = new TextEncoder().encode(JSON.stringify(data.data)).byteLength
        $log.info(`We just nuked anilist to get ~${(len / 1024 / 1024).toFixed(1)}MB of data`);

        return data.data;
    }

    async getUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<Array<string>> | never
    {
        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        // Fetch Data
        const data = await this.apollo.query<userLists, any>({
            query: getUserLists,
            variables: { username, type, statuses }
        });

        // Error Handling @TODO: Throw AnilistError() instead of Error()
        if (data.errors)
            throw new Error(data.errors.map((e: GraphQLError) => `GraphQLError/${e.name}: ${e.message}`).join("\n"));

        return data.data.MediaListCollection?.lists?.map(list => list!.name!) ?? [];
    }

    async getUserList(username: string, type: MediaType, name: string): Promise<userLists_MediaListCollection_lists> | never
    {
        const lists = await this.fetchUserLists(username, type);

        return lists.MediaListCollection?.lists?.find(list => list?.name === name)!;
    }
}
