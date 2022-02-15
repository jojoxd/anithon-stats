import {ISavedData} from "./ISavedData";

export interface IMetadata
{
    allowChunkMerge?: boolean;

    savedData?: { [key: string]: ISavedData };
}