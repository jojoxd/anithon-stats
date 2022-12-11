import { PlatformContext } from "@tsed/common";
import { Env } from "@tsed/core";
import { PlatformCache } from "@tsed/platform-cache";
import { ApolloClient, DocumentNode } from "apollo-boost";
import { GraphQLError } from "graphql";
import { IAnilistApi } from "./IAnilistApi";
import { AnilistError } from "../AnilistError";
import { fetchUserLists, getUserLists, fetchUserLists_MediaListCollection_lists, MediaListStatus, MediaType } from "../generated/types";
export declare class AnilistService implements IAnilistApi {
    static readonly ENDPOINT = "https://graphql.anilist.co";
    protected apollo: ApolloClient<any>;
    protected env: Env;
    protected get cacheConfig(): {
        ttl: {
            searchUserByName: number;
            getUserById: number;
            fetchUserLists: number;
            getUserLists: number;
            currentUser: number;
            findUsersByName: number;
        };
    };
    protected $ctx?: PlatformContext;
    protected cache: PlatformCache;
    protected get token(): string | null;
    constructor();
    protected createError(errors: ReadonlyArray<GraphQLError>): AnilistError;
    fetchUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never;
    getUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<getUserLists> | never;
    getUserList(userId: number, type: MediaType, name: string): Promise<fetchUserLists_MediaListCollection_lists> | never;
    getCurrentUser(): Promise<IAnilistUser | null>;
    searchUserByName(userName: string): Promise<IAnilistUser | never>;
    getUserById(userId: number): Promise<IAnilistUser>;
    findUsersByName(username: string): Promise<Array<IAnilistUser>>;
    protected hashObject(namespace: string, obj: any): string;
    protected query<T, Q, S = T>(settings: {
        query: DocumentNode;
        variables?: Q;
        key: string;
        hash?: any;
        ttl?: number;
        convert?: (val: T) => S;
    }): Promise<S> | never;
}
export interface IAnilistUser {
    id: number;
    name: string;
    avatar: {
        large: string;
    };
}
//# sourceMappingURL=AnilistService.d.ts.map