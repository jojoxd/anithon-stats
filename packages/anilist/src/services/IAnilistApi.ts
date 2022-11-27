"use strict";

import {
    getUserLists,
    fetchUserLists,
    fetchUserLists_MediaListCollection_lists,
    MediaListStatus,
    MediaType,
} from "../generated/types";
import {IAnilistUser} from "./AnilistService";

export interface IAnilistApi
{
    fetchUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never;

    getUserLists(userId: number, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<getUserLists> | never

    getUserList(userId: number, type: MediaType, name: string): Promise<fetchUserLists_MediaListCollection_lists> | never;

    getCurrentUser(): Promise<IAnilistUser | null>;

    searchUserByName(username: string): Promise<IAnilistUser | null>;

    findUsersByName(username: string): Promise<Array<IAnilistUser>>;
}
