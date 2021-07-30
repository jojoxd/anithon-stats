import {IEntry} from "./IEntry";

export interface IChunk
{
    readonly entry: IEntry;

    readonly start: number;

    readonly end: number;

    readonly isJoined: boolean;

    readonly isComplete: boolean;

    readonly progress: number;
}
