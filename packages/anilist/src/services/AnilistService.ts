"use strict";

import {ProviderScope, Scope, Service, Env, $log, UseCache, Constant, PlatformContext} from "@tsed/common";
import {IAnilistApi} from "./IAnilistApi";
import {ApolloClient} from "apollo-boost";
import {ApolloClientBuilder} from "../lib/ApolloClientBuilder";
import getUserLists from "../gql/getUserLists.gql";
import fetchUserLists from "../gql/fetchUserLists.gql";
import {MediaListStatus, MediaType, userLists, userLists_MediaListCollection_lists, userListsVariables} from "../..";
import {GraphQLError} from "graphql";
import {AnilistError} from "../AnilistError";
import getCurrentUser from "../gql/getCurrentUser";
import {InjectContext} from "@tsed/di";

@Service()
@Scope(ProviderScope.REQUEST)
export class AnilistService implements IAnilistApi
{
    public static readonly ENDPOINT = "https://graphql.anilist.co";

    protected apollo: ApolloClient<any>;

    @Constant("env")
    protected env!: Env;

    @InjectContext()
    protected $ctx?: PlatformContext;

    protected get token(): string | null
    {
        $log.info("Context:");
        $log.info(this.$ctx);

        const session: any = this.$ctx?.get("request");

        $log.info("Session:");
        $log.info(session);

        return null;
    }

    constructor()
    {
        // Setup Apollo Client
        const builder = new ApolloClientBuilder(AnilistService.ENDPOINT);

        builder.withAuth(() => this.token ?? null);

        this.apollo = builder.build();
    }

    protected createError(errors: ReadonlyArray<GraphQLError>)
    {
        const errorMessage = errors.map((e: GraphQLError) => `GraphQLError/${e.name}: ${e.message}`).join("\n");
        return new AnilistError(errorMessage, errors);
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

        if (data.errors) {
            throw this.createError(data.errors!);
        }

        if(this.env === Env.DEV) {
            const len = new TextEncoder().encode(JSON.stringify(data.data)).byteLength
            $log.info(`We just nuked anilist to get ~${(len / 1024 / 1024).toFixed(1)}MB of data`);
        }

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

        if (data.errors) {
            throw this.createError(data.errors!);
        }

        return data.data.MediaListCollection?.lists?.map(list => list!.name!) ?? [];
    }

    async getUserList(username: string, type: MediaType, name: string): Promise<userLists_MediaListCollection_lists> | never
    {
        const lists = await this.fetchUserLists(username, type);

        return lists.MediaListCollection?.lists?.find(list => list?.name === name)!;
    }

    async getCurrentUser(): Promise<IAnilistUser | null>
    {
        if(!this.token)
            return null;

        const data = await this.apollo.query<any, any>({
            query: getCurrentUser,
        });

        if(data.errors) {
            throw this.createError(data.errors!);
        }

        const viewer = data.data.Viewer;

        return {
            id: viewer.id,
            name: viewer.name,

            avatar: {
                large: viewer.avatar.large,
            },
        };
    }
}

export interface IAnilistUser
{
    id: string;

    name: string;

    avatar: { large: string };
}