import {computed, Ref, watch} from "vue";
import {useApi} from "./useApi";
import {IAnilistUserMetadata} from "@anistats/shared";

export function useUser(userName: Ref<string>)
{
    const { status, data, reload } = useApi<{ userName: string }, IAnilistUserMetadata>(
        `user/find`,
        computed(() => ({ userName: userName.value }))
    );

    // @DEBUG
    watch(data, () => {
        if(data.value)
            data.value!.isCurrentUser = true;
    })

    return {
        status,
        reload,

        user: computed<IAnilistUserMetadata | null>(() => data.value ?? null)
    }
}
