import {EntryId} from "./entry-ref";

export interface EntryDataDto
{
    ref: EntryId;

    mult: number;

    // @TODO: Order should always be initialized as null
    order: number | null;

    split: number | null;
    splitSequelEntry: boolean;

    startAt: number | null;
}
