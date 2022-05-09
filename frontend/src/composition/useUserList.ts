import {ComputedRef, ref, Ref, computed} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {debouncedWatch, get} from "@vueuse/core";
import {IListData} from "@anistats/shared";

/**
 * Creates a wrapper for User Lists (string-version from Anilist API)
 */
export function useUserList(user: Ref<string | null>, list: Ref<string | null>): UseUserListReturn
{
    const endpoint = ref<string | false>(false);

    debouncedWatch(user, () => {
        console.log('user changed');
        cancel();

        const _user = get(user);
        const _list = get(list);

        if(!_user || !_list) {
            endpoint.value = false;
            return;
        }

        endpoint.value = `user/${_user}/lists/${_list}`;
    }, { immediate: true, debounce: 500 });

    const { status, data, cancel, reload } = useApi<void, IListData["value"]>(endpoint, ref(), true);

    return {
        status,
        reload,

        list: computed(() => data.value),
    };
}

interface UseUserListReturn
{
    status: ComputedRef<ApiStatus>;

    reload: () => Promise<void>;

    list: ComputedRef<IListData["value"] | null>;
}
