"use strict";

import {
    MediaListStatus,
    MediaType,
    userLists,
    userLists_MediaListCollection_lists
} from "../..";
import {IAnilistUser} from "./AnilistService";

export interface IAnilistApi
{
    fetchUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<userLists> | never;

    getUserLists(username: string, type: MediaType, statuses?: MediaListStatus | Array<MediaListStatus>): Promise<string[]> | never

    getUserList(username: string, type: MediaType, name: string): Promise<userLists_MediaListCollection_lists> | never;

    getCurrentUser(): Promise<IAnilistUser | null>;
}
