import { IEntry } from "./IEntry";
import { ChunkStateEnum } from "./chunk/chunk-state.enum";
/**
 * @deprecated use ChunkDto instead
 */
export interface IChunk {
    readonly entry: IEntry;
    readonly start: number;
    readonly end: number;
    readonly isJoined: boolean;
    /**
     * @deprecated Use state === ChunkState.Complete instead.
     */
    readonly isComplete: boolean;
    readonly state: ChunkStateEnum;
    readonly progress: number;
}
//# sourceMappingURL=IChunk.d.ts.map