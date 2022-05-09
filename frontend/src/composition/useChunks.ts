import {useApi} from "./useApi";
import {ref, computed} from "vue";
import {MaybeRef, get} from "@vueuse/core";
import {IChunkList} from "@anistats/shared";

/**
 * Creates a wrapper for chunks API calls
 */
export function useChunks(listId: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _listId = get(listId);

        if(!_listId)
            return false;

        return `list/${_listId}/chunks`;
    })

    return useApi<void, IChunkList>(endpoint, ref());
}
