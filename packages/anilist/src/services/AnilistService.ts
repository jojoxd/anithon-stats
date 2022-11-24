import {ProviderScope, Scope, Service, $log, Constant, PlatformContext, Inject} from "@tsed/common";
import {InjectContext} from "@tsed/di";
import { Env } from "@tsed/core";
import {PlatformCache, UseCache} from "@tsed/platform-cache";

import {ApolloClient, DocumentNode} from "apollo-boost";
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

import { createHash } from "crypto";
import {Mutexes} from "../lib/MutexManager";

@Service()
@Scope(ProviderScope.REQUEST)
export class AnilistService implements IAnilistApi
{
    public static readonly ENDPOINT = "https://graphql.anilist.co";

    protected apollo: ApolloClient<any>;

    @Constant("env")
    protected env!: Env;

    // @TODO: Inject Cache Config (TTL)
	protected get cacheConfig() {
		return {
			ttl: {
				searchUserByName: 600,
				getUserById: 600,

				fetchUserLists: 180,
				getUserLists: 180,

				currentUser: 3600,
			},
		};
	}


    @InjectContext()
    protected $ctx?: PlatformContext;

    @Inject()
    protected cache!: PlatformCache;

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

    async fetchUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never
    {
        $log.info(`AnilistService.fetchUserLists(${userId}, ${type}, [${statuses}])`);

        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        return this.query<fetchUserLists, fetchUserListsVariables>({
			query: fetchUserListsQuery,
			variables: { userId, type, statuses },
			key: 'fetchUserLists',
			ttl: this.cacheConfig.ttl.fetchUserLists,

			// @hack: using a convert function to log some data is not very semantic
			convert: (data) => {
				if(this.env === Env.DEV) {
					const len = new TextEncoder().encode(JSON.stringify(data)).byteLength
					$log.info(`We just nuked anilist to get ~${(len / 1024 / 1024).toFixed(1)}MB of data`);
				}

				return data;
			},
		});
    }

    async getUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<getUserLists> | never
    {
        $log.info(`AnilistService.getUserLists(${userId}, ${type}, ${statuses})`);

        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        return this.query<getUserLists, getUserListsVariables>({
			query: getUserListsQuery,
			variables: { userId, type, statuses },
			key: 'getUserLists',
			ttl: this.cacheConfig.ttl.getUserLists,
		});
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

		// @TODO: Fix typing
		const viewer = await this.query<any, any, any>({
			query: getCurrentUser,
			key: 'currentUser',
			hash: this.token,
			ttl: this.cacheConfig.ttl.currentUser,
			convert: (data) => data.Viewer,
		});

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
		const user = await this.query<searchUserByName, searchUserByNameVariables, searchUserByName['User']>({
			query: searchUserByNameQuery,
			variables: { name: userName },
			key: 'searchUserByName',
			ttl: this.cacheConfig.ttl.searchUserByName,
			convert: (data) => data.User,
		});

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
    	$log.info("Fetching user by userId", { userId });

    	const user = await this.query<getUserById, getUserByIdVariables, getUserById['User']>({
			query: getUserByIdQuery,
			variables: { userId },
			key: 'getUserById',
			ttl: this.cacheConfig.ttl.getUserById,
			convert: (data) => data.User,
		});

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

    protected hashObject(namespace: string, obj: any): string
	{
		const hash = createHash('md5')
			.update(JSON.stringify(obj))
			.digest('hex');

		return `${namespace}:${hash}`;
	}

	protected async query<T, Q, S = T>(settings: { query: DocumentNode, variables?: Q, key: string, hash?: any, ttl?: number, convert?: (val: T) => S }): Promise<S> | never
	{
		const queryFn = async () => {
			const { data, errors } = await this.apollo.query<T, Q>({
				query: settings.query,
				variables: settings.variables,

				fetchPolicy: "network-only",
				errorPolicy: "ignore"
			});

			if(errors) {
				$log.error(data);
				throw this.createError(errors!);
			}

			if (settings.convert) {
				return settings.convert(data);
			}

			return data as unknown as S;
		};

		if (settings.variables ?? settings.hash) {
			// Can use a cache key
			const cacheKey = this.hashObject(settings.key, settings.variables ?? settings.hash);

			const mut = Mutexes.getMutex(cacheKey);

			return mut.runExclusive(async () => {
				return this.cache.wrap(cacheKey, () => {
					return queryFn();
				}, settings.ttl ?? 30);
			});
		}

		return queryFn();
	}
}

export interface IAnilistUser
{
    id: number;

    name: string;

    avatar: { large: string };
}
