import {useApi} from "./useApi";
import {ref, computed} from "vue";
import {MaybeRef, get} from "@vueuse/core";
import {IChunkList} from "@anistats/shared";

/**
 * Creates a wrapper for chunks API calls
 */
export function useChunks(user: MaybeRef<string>, list: MaybeRef<string>)
{
    const endpoint = computed(() => {
        return `chunks/${get(user)}/${get(list)}`
    })

    return useApi<void, IChunkList>(endpoint, ref());
}
