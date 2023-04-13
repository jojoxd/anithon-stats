import {BaseResponse, ChunkDto, EntryId, UpdateEntryProgressRequest} from "@anistats/shared";
import { MaybeRef, get } from "@vueuse/core";
import { AxiosResponse } from "axios";
import { useListStore } from "../../store/list.store";
import {useAxios} from "../use-axios.fn";

export interface UseEntryUpdate
{
	updateEntry(status: 'start' | 'complete', progress: boolean, chunk: MaybeRef<ChunkDto>): Promise<void>;
}

export function useEntryUpdate(entryId: MaybeRef<EntryId>): UseEntryUpdate
{
	const listStore = useListStore();
	
	const axios = useAxios();
	
	async function updateEntry(status: 'start' | 'complete', progress: boolean, chunk: MaybeRef<ChunkDto>): Promise<void>
	{
		const _entryId = get(entryId);
		const entry = listStore.getEntry(_entryId);
		
		if (!entry || !listStore.currentList) {
			return;
		}
		
		const {
			status: responseStatus,
		} = await axios.post<UpdateEntryProgressRequest, AxiosResponse<BaseResponse>>(
			`list/${listStore.currentList.id}/entry/update`,
			{
				id: _entryId,
				status,
				
				progress: progress
					? entry.progress + 1
					: undefined,
			}
		);
		
		if (progress) {
			const _chunk = get(chunk);
			entry.progress += 1;
			_chunk.progress = Math.min(_chunk.progress, _chunk.end);
		}
		
		console.log('responseStatus', responseStatus);
	
		// await listStore.reload();
	}
	
	return {
		updateEntry,
	};
}
