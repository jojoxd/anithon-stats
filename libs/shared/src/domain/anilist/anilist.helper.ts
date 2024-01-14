import { AnilistSeriesId } from "../../dto/anilist/series/anilist-series-id.type";
import { AnilistUserId } from "../../dto/anilist/user/anilist-user-id.type";

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
