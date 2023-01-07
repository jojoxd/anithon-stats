import {ListMetadataDto} from "../../list/metadata/list-metadata.dto";
import {ListId} from "../../list/list-ref";

export interface SearchGlobalListDto extends ListMetadataDto
{
    id: ListId;
}
