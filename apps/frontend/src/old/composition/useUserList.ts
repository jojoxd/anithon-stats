import {ComputedRef, ref, Ref, computed} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {debouncedWatch, get, MaybeRef} from "@vueuse/core";
import {IListData, UserIdentifier} from "@anistats/shared";
import {ensureUserIdent, MaybeUserIdentifierRef, MaybeUserIdentifierTypeRef} from "./util/ensureUserIdent";

/**
 * Creates a wrapper for User Lists (string-version from Anilist API)
 */
export function useUserList(user: MaybeUserIdentifierRef, listId: MaybeRef<string | null>, type?: MaybeUserIdentifierTypeRef): UseUserListReturn
{
    const endpoint = computed(() => {
        const _user = get(user);
        const _listId = get(listId);

        if(!_user || !_listId) {
            return false;
        }

        return `user/list/${_listId}`;
    });

    const identifier = ensureUserIdent(user, type);

    const { status, data, cancel, reload } = useApi<UserIdentifier, IListData["lists"][0]>(endpoint, identifier, true, "POST");

    return {
        status,
        reload,

        list: computed(() => data.value ?? null),
    };
}

interface UseUserListReturn
{
    status: ComputedRef<ApiStatus>;

    reload: () => Promise<void>;

    list: ComputedRef<IListData["lists"][0] | null>;
}
