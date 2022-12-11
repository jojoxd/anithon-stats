import { ISeriesTitle } from "./ISeriesTitle";
/**
 * @deprecated use SeriesDto instead
 */
export interface ISeriesData {
    readonly id: number;
    readonly title: ISeriesTitle;
    readonly coverImage: string;
    readonly duration: number;
    readonly episodes: number | null;
    readonly notes: string | null;
    readonly description: string | null;
}
//# sourceMappingURL=ISeriesData.d.ts.map