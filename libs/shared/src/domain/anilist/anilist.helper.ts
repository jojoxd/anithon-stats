import {AnilistSeriesId, AnilistUserId} from "@anistats/shared";

export class AnilistHelper
{
    public static getUserUrl(userId: AnilistUserId): string
    {
        return `https://anilist.co/user/${userId}`;
    }

    public static getSeriesUrl(seriesId: AnilistSeriesId): string
    {
        return `https://anilist.co/anime/${seriesId}`;
    }
}
