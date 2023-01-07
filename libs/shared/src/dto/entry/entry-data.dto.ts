import {EntryId} from "./entry-ref";

export interface EntryDataDto
{
    ref: EntryId;

    mult: number;

    order: number;

    split: number | null;
    splitSequelEntry: boolean;

    startAt: number | null;
}
