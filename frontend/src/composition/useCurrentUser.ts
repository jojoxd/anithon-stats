import {computed, ref} from "vue";
import {IUseApiReturnData, useApi} from "./useApi";
import {ICurrentUser} from "@anistats/shared";

export function useCurrentUser()
{
    const { status, data, reload } = useApi<void, ICurrentUser>(`user/@current`, ref());

    return {
        status,
        reload,

        currentUser: computed<ICurrentUser | null>(() => data.value ?? null),
    }
}
