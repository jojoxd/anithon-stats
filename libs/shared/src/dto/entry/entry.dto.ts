import {EntryId, EntryRef} from "./entry-ref";
import {EntryStatusEnum} from "./entry-status.enum";
import {SeriesRef} from "../series/series-ref";

export interface EntryDto
{
    id: EntryId;

    series: SeriesRef;

    episodes: number;

    hasJoinedLastChunk: boolean;

    stats: {
        chunks: number;
        time: number;
    };

    status: EntryStatusEnum;

    sequel: EntryRef;
}
