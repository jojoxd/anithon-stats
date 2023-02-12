import {EntryId, EntryDto, SeriesDto, EntryStatusEnum} from "@anistats/shared";

export class EntryDtoFactory
{
    public static createFromSeriesDto(entryId: EntryId, series: SeriesDto): EntryDto
    {
        const entryDto: EntryDto = {
            id: entryId,

            series: {
                ref: series.id,
            },

            episodes: series.episodes ?? 1,

            hasJoinedLastChunk: false,

            // @TODO: Hydrate if possible
            sequel: null,

            stats: {
                time: (series.episodes ?? 1) * series.duration,
                chunks: -1,
            },

            // @TODO: Can we get this from series?
            status: EntryStatusEnum.Planning,
        };

        return entryDto;
    }
}
