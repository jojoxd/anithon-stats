import {ComputedRef, ref, Ref, computed} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {debouncedWatch, get} from "@vueuse/core";
import {IAnilistUserMetadata, IListData} from "@anistats/shared";

/**
 * Creates a wrapper for User Lists (string-version from Anilist API)
 */
export function useUserLists(user: Ref<IAnilistUserMetadata | null>): UseUserListsReturn
{
    const endpoint = ref<string | false>(false);

    debouncedWatch(user, () => {
        console.log('user changed');
        cancel();

        const _user = get(user);

        if(!_user) {
            endpoint.value = false;
            return;
        }

        endpoint.value = `user/${_user.id}/lists`;
    }, { immediate: true, debounce: 500 });

    const { status, data, cancel, reload } = useApi<void, IListData>(endpoint, ref(), true);

    return {
        status,

        lists: computed(() => data.value),

        listNames: computed(() => {
            if(data.value) {
                const keys = Object.keys(data.value);

                return keys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            }

            return null;
        })
    };
}

interface UseUserListsReturn
{
    status: ComputedRef<ApiStatus>;

    lists: ComputedRef<IListData | null>;

    listNames: ComputedRef<Array<string> | null>;
}
