import {ListMetadataStatsDto} from "./list-metadata-stats.dto";
import {ListRef} from "../list-ref";

export interface ListMetadataDto
{
    title: string;

    ref: ListRef;

    description: string;

    stats: ListMetadataStatsDto;
}

