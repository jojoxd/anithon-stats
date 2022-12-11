import {ChunkDto} from "./chunk.dto";

export interface ChunkListResponse
{
	readonly chunks: Array<ChunkDto>;

	readonly weightedProgress: number;
}
