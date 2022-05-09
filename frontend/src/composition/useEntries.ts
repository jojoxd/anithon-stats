import {useApi} from "./useApi";
import {ref, watch, computed} from "vue";
import {IEntry} from "@anistats/shared";
import { MaybeRef, get } from "@vueuse/core";

/**
 * Creates a wrapper for entry API calls
 */
export function useEntries(user: MaybeRef<string>, list: MaybeRef<string>)
{
    const endpoint = computed(() => {
        return `${get(user)}/list/${get(list)}/entries`;
    });

    return useApi<void, Array<IEntry>>(endpoint, ref());
}
