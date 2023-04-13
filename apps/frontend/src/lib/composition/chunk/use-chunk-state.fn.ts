import { get } from "@vueuse/core";
import { ComputedRef, computed, Ref } from "vue";
import {computedExtract} from "../../util/computed-extract.fn";
import {ChunkDto, ChunkStateEnum} from "@anistats/shared";
import {mdiCheck, mdiChevronDoubleRight, mdiClose, mdiPlay} from "@mdi/js";
import { useEntry } from "../entry/use-entry.fn";

export interface UseChunkState
{
	color: ComputedRef<string>;
	
	icon: ComputedRef<string>;
	
	state: ComputedRef<ChunkStateEnum>;
}

interface ChunkStateData
{
	icon: string;
	color: string;
}

export function useChunkState(chunk: Ref<ChunkDto>, hasProgressAfter: Ref<boolean>, isLastChunk: Ref<boolean>): UseChunkState
{
	const state = computedExtract(chunk, (chunk) => chunk.state);
	
	const data = computed<ChunkStateData>(() => {
		const _state = get(state);
		const _hasProgressAfter = get(hasProgressAfter);
		const _isLastChunk = get(isLastChunk);
		
		switch(_state) {
			case ChunkStateEnum.NotStarted:
				if (_hasProgressAfter && !_isLastChunk) {
					return {
						color: 'warning',
						icon: mdiChevronDoubleRight,
					};
				}
			
				return {
					color: 'info',
					icon: mdiChevronDoubleRight,
				};
				
			case ChunkStateEnum.Started:
				if (_hasProgressAfter) {
					return {
						color: 'warning',
						icon: mdiChevronDoubleRight,
					};
				}
		
				return {
					color: 'success',
					icon: mdiPlay,
				};
		
			case ChunkStateEnum.Complete:
				return {
					color: 'success',
					icon: mdiCheck,
				};
				
			case ChunkStateEnum.Dropped:
				return {
					color: 'error',
					icon: mdiClose,
				};
		}
		
		throw new Error("ChunkState Exhausted");
	});
	
	return {
		color: computedExtract(data, (_data) => _data.color),
		
		icon: computedExtract(data, (_data) => _data.icon),
		
		state,
	};
}