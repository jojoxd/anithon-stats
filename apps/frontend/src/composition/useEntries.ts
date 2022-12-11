import {useApi} from "./useApi";
import {ref, computed} from "vue";
import {IEntry} from "@anistats/shared";
import { MaybeRef, get } from "@vueuse/core";

/**
 * Creates a wrapper for entry API calls
 */
export function useEntries(listId: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _listId = get(listId);

        if(!_listId)
            return false;

        return `list/${_listId}/entries`;
    });

    return useApi<void, Array<IEntry>>(endpoint, ref());
}
