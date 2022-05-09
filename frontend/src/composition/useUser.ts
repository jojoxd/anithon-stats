import {computed, ref, watch} from "vue";
import {useApi} from "./useApi";
import {IAnilistUserMetadata} from "@anistats/shared";
import {MaybeRef, get} from "@vueuse/core";

export function useUser(userName: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _userName = get(userName);

        if(!_userName)
            return false;

        return `user/${_userName}`;
    });

    const {
        status,
        data,
        reload
    } = useApi<void, IAnilistUserMetadata>(endpoint, ref());

    return {
        status,
        reload,

        user: computed<IAnilistUserMetadata | null>(() => data.value ?? null)
    }
}
