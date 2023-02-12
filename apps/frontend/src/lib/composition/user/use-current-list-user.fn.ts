import {storeToRefs} from "pinia";
import {computed, ComputedRef} from "vue";
import { get } from "@vueuse/core";
import { UserDto } from "@anistats/shared";
import { useListStore } from "../../store/list.store";

export interface UseCurrentListUser
{
    currentListUser: ComputedRef<UserDto | undefined | null>;
}

export function useCurrentListUser(): UseCurrentListUser
{
    const listStore = useListStore();

    const {
        currentList
    } = storeToRefs(listStore);

    const currentListUser = computed(() => {
        const _currentList = get(currentList);

        return _currentList?.user;
    });

    return {
        currentListUser,
    };
}
