import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import {computed, ComputedRef} from "vue";
import { useAuthStore } from "../../store/auth.store";
import { useListStore } from "../../store/list.store";

export interface UseCanEditCurrentList
{
	canEdit: ComputedRef<boolean>;
}

export function useCanEditCurrentList(): UseCanEditCurrentList
{
	const listStore = useListStore();
	const authStore = useAuthStore();

	const {
		user: listUser,
	} = storeToRefs(listStore);

	const {
		currentUser,
	} = storeToRefs(authStore);

	const canEdit = computed(() => {
		const _listUser = get(listUser);
		const _currentUser = get(currentUser);

		return !!_currentUser && _currentUser?.id === _listUser?.id;
	});

	return {
		canEdit,
	};
}
