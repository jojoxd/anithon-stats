import {ListId} from "../../dto/list/list-ref";
import {EntryDataDto} from "../../dto/entry/entry-data.dto";
import {ListSettingsDto} from "../../dto/list/list-settings.dto";
import {EntryDto} from "../../dto/entry/entry.dto";

export interface UpdateListRequest
{
    id: ListId;

    settings: ListSettingsDto;

    data: Array<EntryDataDto>;

    entries: Array<EntryDto>;
}
