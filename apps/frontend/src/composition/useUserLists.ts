import {ComputedRef, computed} from "vue";
import {ApiStatus, useApi} from "./useApi";
import {get} from "@vueuse/core";
import {IListData, IUserData, UserIdentifier} from "@anistats/shared";
import {ensureUserIdent, MaybeUserIdentifierRef, MaybeUserIdentifierTypeRef} from "./util/ensureUserIdent";

/**
 * Creates a wrapper for User Lists (string-version from Anilist API)
 */
export function useUserLists(ident: MaybeUserIdentifierRef, type?: MaybeUserIdentifierTypeRef): UseUserListsReturn
{
	const endpoint = computed(() => {
		const _ident = get(ident);

		if(!_ident)
			return false;

		return `user/lists`;
	});

    const identifier = ensureUserIdent(ident, type)

    const { status, data, cancel, reload } = useApi<UserIdentifier, IListData>(endpoint, identifier, true, "POST");

    return {
        status,
		reload,
		cancel,

        lists: computed(() => data.value?.lists ?? null),

		listUser: computed(() => data.value?.user ?? null),

        listNames: computed(() => {
            if(data.value?.lists) {
                const keys = Object.keys(data.value.lists);

                return keys.sort((a, b) => {
                	return a.localeCompare(b, undefined, {
                		numeric: true
                	});
				});
            }

            return null;
        }),
    };
}

interface UseUserListsReturn
{
    status: ComputedRef<ApiStatus>;

    reload: () => Promise<void>;

    cancel: () => void;

    lists: ComputedRef<IListData["lists"] | null>;

    listUser: ComputedRef<IUserData | null>;

    listNames: ComputedRef<Array<string> | null>;
}
