import {ChunkStateEnum} from "./chunk-state.enum";
import {EntryRef} from "../entry/entry-ref";

export interface ChunkDto
{
	rootEntry: EntryRef;

    entry: EntryRef;

    start: number;

    end: number;

    isJoined: boolean;

    state: ChunkStateEnum;

    progress: number;
}
