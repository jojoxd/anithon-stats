import {EntryDto} from "./entry.dto";
import {EntryDataDto} from "./entry-data.dto";

export interface EntryListDto
{
    items: Array<EntryDto>;

    data: Array<EntryDataDto>;
}