import {IChunk} from "./IChunk";

/**
 * @deprecated use ChunkListResponse instead
 */
export interface IChunkList
{
    readonly weightedProgress: number;

    readonly chunks: Array<IChunk>;
}
