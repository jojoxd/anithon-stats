import {computed, ref} from "vue";
import {useApi} from "./useApi";
import {UserResponse} from "@anistats/shared";

export function useCurrentUser()
{
    const { status, data, reload } = useApi<void, UserResponse>(`user`, ref());

    return {
        status,
        reload,

        currentUser: computed<UserResponse | null>(() => data.value ?? null),
    }
}
