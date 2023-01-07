import {UserDto} from "../user/user.dto";
import {ListMetadataDto} from "./metadata/list-metadata.dto";
import {ListId} from "./list-ref";
import {EntryListDto} from "../entry/entry-list.dto";
import {ChunkListDto} from "../chunk/chunk-list.dto";
import {ListSettingsDto} from "./list-settings.dto";
import {SeriesListDto} from "../series/series-list.dto";

export interface ListDto
{
    id: ListId;

    user: UserDto;

    settings: ListSettingsDto;

    metadata: ListMetadataDto;

    entries: EntryListDto;

    chunks: ChunkListDto;

    series: SeriesListDto;
}
