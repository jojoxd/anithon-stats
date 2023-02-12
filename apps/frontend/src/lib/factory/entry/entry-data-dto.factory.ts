import {EntryDataDefaults, EntryDataDto, EntryId} from "@anistats/shared";

export class EntryDataDtoFactory
{
    public static create(entryId: EntryId): EntryDataDto
    {
        const entryDataDto: EntryDataDto = {
            ref: entryId,

            // @TODO: Get max order somehow?
            order: +Infinity,

            mult: EntryDataDefaults.MULTIPLIER,

            split: EntryDataDefaults.SPLIT,

            splitSequelEntry: EntryDataDefaults.SPLIT_SEQUEL_ENTRY,

            startAt: EntryDataDefaults.START_AT,
        };

        return entryDataDto;
    }
}