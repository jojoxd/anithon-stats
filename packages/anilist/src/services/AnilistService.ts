import {ProviderScope, Scope, Service, $log, Constant, PlatformContext} from "@tsed/common";
import {InjectContext} from "@tsed/di";
import { Env } from "@tsed/core";
import { UseCache } from "@tsed/platform-cache";

import {ApolloClient} from "apollo-boost";
import {GraphQLError} from "graphql";

import {IAnilistApi} from "./IAnilistApi";
import {AnilistNotAUserError} from "../AnilistNotAUserError";
import {AnilistError} from "../AnilistError";
import {ApolloClientBuilder} from "../lib/ApolloClientBuilder";

import {
    MediaListStatus,
    MediaType
} from "../..";

import getUserByIdQuery from "../gql/getUserById.gql";
import searchUserByNameQuery from "../gql/searchUserByName.gql"
import getCurrentUser from "../gql/getCurrentUser.gql";
import getUserListsQuery from "../gql/getUserLists.gql";
import fetchUserListsQuery from "../gql/fetchUserLists.gql";

import {
    fetchUserLists,
    fetchUserListsVariables,
    getUserLists,
    getUserListsVariables,
    fetchUserLists_MediaListCollection_lists,
    searchUserByName, searchUserByNameVariables, getUserById, getUserByIdVariables,
} from "../generated/types";

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
        try {
            return this.$ctx?.getRequest?.()?.session?.anilist_token ?? null;
        } catch(e) {
            $log.warn(e);

            return null;
        }
    }

    constructor()
    {
        // Setup Apollo Client
        const builder = new ApolloClientBuilder(AnilistService.ENDPOINT);

        builder.withAuth(() => this.token);

        this.apollo = builder.build();
    }

    protected createError(errors: ReadonlyArray<GraphQLError>)
    {
        const errorMessage = errors.map((e: GraphQLError) => `GraphQLError/${e.name}: ${e.message}`).join("\n");
        return new AnilistError(errorMessage, errors);
    }

    @UseCache({ ttl: 30 })
    async fetchUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never
    {
        $log.info(`AnilistService.fetchUserLists(${userId}, ${type}, [${statuses}])`);

        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        // Fetch Data
        const data = await this.apollo.query<fetchUserLists, fetchUserListsVariables>({
            query: fetchUserListsQuery,
            variables: { userId, type, statuses },
            fetchPolicy: "network-only",
            errorPolicy: "ignore",
        });

        if (data.errors) {
            $log.error(data.data);
            throw this.createError(data.errors!);
        }

        if(this.env === Env.DEV) {
            const len = new TextEncoder().encode(JSON.stringify(data.data)).byteLength
            $log.info(`We just nuked anilist to get ~${(len / 1024 / 1024).toFixed(1)}MB of data`);
        }

        return data.data;
    }

    async getUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<getUserLists> | never
    {
        $log.info(`AnilistService.getUserLists(${userId}, ${type}, ${statuses})`);

        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        // Fetch Data
        const data = await this.apollo.query<getUserLists, getUserListsVariables>({
            query: getUserListsQuery,
            variables: { userId, type, statuses },
            fetchPolicy: "network-only",
            errorPolicy: "ignore",
        });

        if (data.errors) {
            $log.error(data.data);
            throw this.createError(data.errors!);
        }

        return data.data;
    }

    async getUserList(userId: number, type: MediaType, name: string): Promise<fetchUserLists_MediaListCollection_lists> | never
    {
        $log.info("AnilistService.getUserList()");

        const lists = await this.fetchUserLists(userId, type);

        return lists.MediaListCollection?.lists?.find(list => list?.name === name)!;
    }

    async getCurrentUser(): Promise<IAnilistUser | null>
    {
        if(!this.token)
            return null;

        $log.info("AnilistService.getCurrentUser()");

        const data = await this.apollo.query<any, any>({
            query: getCurrentUser,
            fetchPolicy: "network-only",
            errorPolicy: "ignore",
        });

        if(data.errors) {
            $log.error(data.data);
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

    async searchUserByName(userName: string): Promise<IAnilistUser | never>
    {
        const data = await this.apollo.query<searchUserByName, searchUserByNameVariables>({
            query: searchUserByNameQuery,
            variables: { name: userName },
            fetchPolicy: "network-only",
            errorPolicy: "ignore"
        });

        if(data.errors) {
            $log.error(data.data);
            throw this.createError(data.errors!);
        }

        const user = data.data.User;

        if(!user || !user.id)
            throw new AnilistNotAUserError(`User "${userName}" does not exist on AniList`);

        return {
            id: user.id,
            name: user.name,

            avatar: {
                large: user!.avatar!.large ?? user!.avatar!.medium!,
            },
        };
    }

    async getUserById(userId: number): Promise<IAnilistUser>
    {
    	$log.info("Fetching user by userId", { userId, stack: new Error().stack });

        const data = await this.apollo.query<getUserById, getUserByIdVariables>({
            query: getUserByIdQuery,
            variables: { userId },
            fetchPolicy: "network-only",
            errorPolicy: "ignore"
        });

        if(data.errors) {
            $log.error(data.data);
            throw this.createError(data.errors!);
        }

        const user = data.data.User;

        if(!user || !user.id)
            throw new AnilistNotAUserError(`User "${userId}" does not exist on AniList`);

        return {
            id: user.id,
            name: user.name,

            avatar: {
                large: user!.avatar!.large ?? user!.avatar!.medium!,
            },
        };
    }
}

export interface IAnilistUser
{
    id: number;

    name: string;

    avatar: { large: string };
}
