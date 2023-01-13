import {Service} from "@tsed/di";
import {Inject} from "@tsed/common";
import {AnilistClientService} from "./AnilistClientService";
import {
    AnilistNotAUserError,
    IAnilistUser, MediaType,
} from "..";
import searchUserByNameQuery from "../gql/searchUserByName.gql";
import searchSeriesQuery from "../gql/searchSeries.gql";

import {
    searchUserByName, searchUserByNameVariables,
    searchSeries, searchSeriesVariables, searchSeries_Page_media,
} from "../generated/types";

@Service()
export class AnilistSearchService
{
    @Inject()
    private client!: AnilistClientService;

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

                searchSeries: 3600,
            },
        };
    }

    async searchUserByName(userName: string): Promise<IAnilistUser | never>
    {
        const user = await this.client.query<searchUserByName, searchUserByNameVariables, searchUserByName['User']>({
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

    async searchSeriesByName(query: string, type: MediaType): Promise<Array<searchSeries_Page_media>>
    {
        return this.client.query<searchSeries, searchSeriesVariables, Array<searchSeries_Page_media>>({
            query: searchSeriesQuery,
            variables: { query, type, },
            key: 'searchSeries',
            ttl: this.cacheConfig.ttl.searchSeries,
            convert: (data) => data.Page!.media! as Array<searchSeries_Page_media>,
        });
    }
}
