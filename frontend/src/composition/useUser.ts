import {computed} from "vue";
import {useApi} from "./useApi";
import {IUserData, UserIdentifier} from "@anistats/shared";
import {get} from "@vueuse/core";
import {ensureUserIdent, MaybeUserIdentifierRef, MaybeUserIdentifierTypeRef} from "./util/ensureUserIdent";

export function useUser(ident: MaybeUserIdentifierRef, type?: MaybeUserIdentifierTypeRef)
{
    const endpoint = computed(() => {
        const _ident = get(ident);

        if(!_ident)
            return false;

        return `user/get`;
    });

    const identifier = ensureUserIdent(ident, type);

    const {
        status,
        data,
        reload,
    } = useApi<UserIdentifier, IUserData>(endpoint, identifier, true, "POST");

    return {
        status,
        reload,

        user: computed<IUserData | null>(() => data.value ?? null),
    };
}
