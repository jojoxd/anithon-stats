import {ISeriesData} from "./ISeriesData";
import {ISavedData} from "./ISavedData";

export interface IEntry
{
    readonly savedData: ISavedData;

    readonly series: ISeriesData;

    readonly episodes: number;

    readonly hasJoinedLastChunk: boolean;

    readonly chunks: number;

    readonly totalTime: number;

    readonly id: number;

    readonly isDropped: boolean;

    /**
     * Only defined on the {@see /api/:user/list/:list/entries} endpoint
     */
    readonly sequel?: IEntry;
}
