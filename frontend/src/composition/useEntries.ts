import {useApi} from "./useApi";
import {ref, computed} from "vue";
import {IEntry} from "@anistats/shared";
import { MaybeRef, get } from "@vueuse/core";

/**
 * Creates a wrapper for entry API calls
 */
export function useEntries(user: MaybeRef<string>, list: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _user = get(user);
        const _list = get(list);

        if(!_user || !_list)
            return false;

        return `entries/${_user}/${_list}`;
    });

    return useApi<void, Array<IEntry>>(endpoint, ref());
}
