import { EntryId } from "../../../dto/entry/entry-ref";

export interface UpdateEntryProgressRequest
{
	id: EntryId;
	
	status?: 'start' | 'complete';
	
	progress?: number;
}