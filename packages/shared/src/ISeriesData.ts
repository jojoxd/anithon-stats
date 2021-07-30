import {ISeriesTitle} from "./ISeriesTitle";

export interface ISeriesData
{
    readonly id: number;

    readonly title: ISeriesTitle;

    readonly coverImage: string;

    readonly duration: number;

    readonly notes: string | null;
}
