import {IChunk} from "./IChunk";
import {IUserData} from "./IUserData";

export interface IChunkList
{
    readonly user: IUserData;

    readonly weightedProgress: number;

    readonly chunks: Array<IChunk>;
}
