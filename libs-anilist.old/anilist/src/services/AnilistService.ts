import {ProviderScope, Scope, Service, $log, Inject, Constant} from "@tsed/common";
import { Env } from "@tsed/core";

import {IAnilistApi} from "./IAnilistApi";
import {AnilistNotAUserError} from "../AnilistNotAUserError";

import getUserByIdQuery from "../gql/getUserById.gql";
import searchUserByNameQuery from "../gql/searchUserByName.gql";
import getCurrentUser from "../gql/getCurrentUser.gql";
import getUserListsQuery from "../gql/getUserLists.gql";
import fetchUserListsQuery from "../gql/fetchUserLists.gql";
import findUsersByNameQuery from "../gql/findUsersByName.gql";

import {
    fetchUserLists, fetchUserListsVariables,
    getUserLists, getUserListsVariables,
	findUsersByName, findUsersByNameVariables,
	getUserById, getUserByIdVariables,
	fetchUserLists_MediaListCollection_lists,
	findUsersByName_Page_users,
	MediaListStatus, MediaType
} from "../generated/types";

import {AnilistClientService} from "./AnilistClientService";

@Service()
@Scope(ProviderScope.REQUEST)
export class AnilistService implements IAnilistApi
{
	@Inject()
    protected client!: AnilistClientService;

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
				findUsersByName: 3600,
			},
		};
	}

    constructor()
    {
    }

    async fetchUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never
    {
        $log.info(`AnilistService.fetchUserLists(${userId}, ${type}, [${statuses}])`);

        // Normalize Statuses
        if (typeof statuses === "undefined")
            statuses = Object.values(MediaListStatus);

        if (!Array.isArray(statuses))
            statuses = [statuses];

        return this.client.query<fetchUserLists, fetchUserListsVariables>({
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

        return this.client.query<getUserLists, getUserListsVariables>({
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
        if(!this.client.token)
            return null;

        $log.info("AnilistService.getCurrentUser()");

		// @TODO: Fix typing
		const viewer = await this.client.query<any, any, any>({
			query: getCurrentUser,
			key: 'currentUser',
			hash: this.client.token,
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

    async getUserById(userId: number): Promise<IAnilistUser>
    {
    	$log.info("Fetching user by userId", { userId });

    	const user = await this.client.query<getUserById, getUserByIdVariables, getUserById['User']>({
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

    async findUsersByName(username: string): Promise<Array<IAnilistUser>>
	{
		const users = await this.client.query<findUsersByName, findUsersByNameVariables, Array<null | findUsersByName_Page_users>>({
			query: findUsersByNameQuery,
			variables: { query: username, page: 0, perPage: 10 },
			key: 'findUsersByName',
			ttl: this.cacheConfig.ttl.findUsersByName,
			convert: (data) => data!.Page!.users!,
		});

		return users.map((gqlUser) => {
			return {
				id: gqlUser!.id,
				name: gqlUser!.name,

				avatar: {
					large: gqlUser!.avatar!.large! ?? gqlUser!.avatar!.medium!,
				},
			};
		});
	}
}

export interface IAnilistUser
{
    id: number;

    name: string;

    avatar: { large: string };
}
