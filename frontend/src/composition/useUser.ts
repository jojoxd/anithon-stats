import {computed, ref} from "vue";
import {useApi} from "./useApi";
import {IAnilistUserMetadata} from "@anistats/shared";
import {MaybeRef, get} from "@vueuse/core";

// @TODO: Change to useUserSearch
export function useUser(userNameOrId: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _userNameOrId = get(userNameOrId);

        if(!_userNameOrId)
            return false;

        return `user/${_userNameOrId}`;
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
