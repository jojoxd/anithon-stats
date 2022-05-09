import {ComputedRef, ref, Ref, computed} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {debouncedWatch} from "@vueuse/core";

/**
 * Creates a wrapper for User Lists (string-version from Anilist API)
 */
export function useUserLists(user: Ref<string | null>): UseUserListsReturn
{
    const apiData = ref<FetchUserListsDTO>({ user: null });

    debouncedWatch(user, () => {
        console.log('user changed');
        cancel();

        if(user.value) {
            apiData.value = {
                user: user.value
            };
        }
    }, { immediate: true, debounce: 500 });

    const { status, data, cancel } = useApi<FetchUserListsDTO, Array<string>>('user/lists', apiData, false);

    return {
        status,

        lists: computed(() => data.value),
    };
}

interface UseUserListsReturn
{
    status: ComputedRef<ApiStatus>;

    lists: ComputedRef<Array<any> | null>;
}

interface FetchUserListsDTO
{
    user: string | null;
}