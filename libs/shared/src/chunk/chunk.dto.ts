/**
 * A single Chunk
 */
import {ChunkStateEnum} from "./chunk-state.enum";
import {EntryDto} from "../entry/entry.dto";

export interface ChunkDto
{
	readonly entry: EntryDto;

	readonly start: number;

	readonly end: number;

	readonly isJoined: boolean;

	readonly state: ChunkStateEnum;

	readonly progress: number;
}
