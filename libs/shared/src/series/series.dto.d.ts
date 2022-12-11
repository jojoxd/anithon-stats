import { SeriesTitleDto } from "./series-title.dto";
export interface SeriesDto {
    readonly id: number;
    readonly title: SeriesTitleDto;
    readonly coverImage: string;
    readonly duration: number;
    readonly episodes: number | null;
    readonly notes: string | null;
    readonly description: string | null;
}
//# sourceMappingURL=series.dto.d.ts.map