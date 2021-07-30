import {ComputedRef, ref, Ref} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {debouncedWatch} from "@vueuse/core";

export function useUserLists(user: Ref<string>): UseUserListsReturn
{
    const apiData = ref<FetchUserListsDTO>({ user: null });

    debouncedWatch(user, () => {
        console.log('user changed');

        if(user.value) {
            apiData.value = {
                user: user.value
            };
        }
    }, { immediate: true, debounce: 500 });

    const { status, data } = useApi<FetchUserListsDTO, any>('user/lists', apiData, false);

    return {
        status,

        lists: data
    };
}

interface UseUserListsReturn
{
    status: ComputedRef<ApiStatus>;

    lists: ComputedRef<Array<any>>;
}

interface FetchUserListsDTO
{
    user: string | null;
}