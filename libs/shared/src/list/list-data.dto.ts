import {ListDataMetadataDto} from "./list-data-metadata.dto";

export interface ListDataDto
{
	readonly id: string;

	readonly name: string;

	readonly metadata: ListDataMetadataDto;
}
