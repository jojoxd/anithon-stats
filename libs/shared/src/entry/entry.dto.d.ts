import { SeriesDto } from "../series/series.dto";
import { SavedDataDto } from "../saved-data/saved-data.dto";
export interface EntryDto {
    readonly id: number;
    readonly series: SeriesDto;
    readonly episodes: number;
    readonly hasJoinedLastChunk: boolean;
    readonly chunks: number;
    readonly totalTime: number;
    readonly isDropped: boolean;
    readonly progress: number;
    readonly savedData: SavedDataDto;
    /**
     * The sequel of this entry
     *
     * Only defined on the {@see /api/:user/list/:list/entries} endpoint
     */
    readonly sequel?: EntryDto;
}
//# sourceMappingURL=entry.dto.d.ts.map