import {ISeriesTitle} from "./ISeriesTitle";

export interface ISeriesData
{
    readonly id: number;

    readonly title: ISeriesTitle;

    readonly coverImage: string;

    readonly duration: number;

    readonly episodes: number | null;

    readonly notes: string | null;

    readonly description: string | null;
}
