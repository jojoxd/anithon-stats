import {ListId} from "../../dto/list/list-ref";
import {EntryDataDto} from "../../dto/entry/entry-data.dto";
import {ListSettingsDto} from "../../dto/list/list-settings.dto";
import {SeriesId} from "../../dto/series/series-ref";

export interface UpdateListRequest
{
    id: ListId;

    settings: ListSettingsDto;

    data: Array<EntryDataDto>;

    addSeries?: Array<SeriesId>;

    removeSeries?: Array<SeriesId>;
}
