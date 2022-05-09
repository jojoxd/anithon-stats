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
    fetchUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<fetchUserLists> | never;

    getUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<getUserLists> | never

    getUserList(username: string, type: MediaType, name: string): Promise<fetchUserLists_MediaListCollection_lists> | never;

    getCurrentUser(): Promise<IAnilistUser | null>;

    getUser(username: string): Promise<IAnilistUser | null>;
}
