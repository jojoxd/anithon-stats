import {ListDto} from "../../dto/list/list.dto";
import {EntryDto} from "../../dto/entry/entry.dto";
import {ChunkDto} from "../../dto/chunk/chunk.dto";
import {SeriesDto} from "../../dto/series/series.dto";
import {EntryId} from "../../dto/entry/entry-ref";
import {SeriesId} from "../../dto/series/series-ref";
import {EntryDataDto} from "../../dto/entry/entry-data.dto";

export class ListHelperUtil
{
    constructor(
        protected list: ListDto,
    ) {}

    public get entries(): Array<EntryDto>
    {
        return this.list.entries.items;
    }

    public get chunks(): Array<ChunkDto>
    {
        return this.list.chunks.items;
    }

    public get series(): Array<SeriesDto>
    {
        return this.list.series.items;
    }

    public getEntryData(entryId: EntryId): Readonly<EntryDataDto> | null
    {
        return this.list.entries.data.find((entryDataDto) => {
            return entryDataDto.ref === entryId;
        }) ?? null;
    }

    public getSeries(seriesId: SeriesId): SeriesDto | null
    {
        return this.series.find(series => series.id === seriesId) ?? null;
    }

    public getChunks(entryId: EntryId): Array<ChunkDto> | null
    {
        const chunks = this.chunks.filter((chunk) => {
            return chunk.entry.ref === entryId;
        });

        return chunks.length > 0 ? chunks : null;
    }
}
