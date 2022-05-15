import {IChunk} from "./IChunk";

export interface IChunkList
{
    readonly weightedProgress: number;

    readonly chunks: Array<IChunk>;
}
