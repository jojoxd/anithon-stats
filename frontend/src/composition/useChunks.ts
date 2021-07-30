import {useApi} from "./useApi";
import {ref} from "vue";
import {IChunkList} from "@anistats/shared";

export function useChunks(user: string, list: string)
{
    return useApi<void, IChunkList>(`${user}/list/${list}/chunks`, ref());
}