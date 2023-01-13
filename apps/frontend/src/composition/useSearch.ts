import {useDebounce, get} from "@vueuse/core";
import {computed, Ref} from "vue";
import {useApi} from "./useApi";
import {SearchGlobalRequest, SearchGlobalResponse} from "@anistats/shared";

export function useSearch(query: Ref<string>, debounce: number = 250)
{
	const debouncedQuery = useDebounce(query, debounce);

	const request = computed<SearchGlobalRequest | null>(() => {
		const query = get(debouncedQuery);

		// If query is empty, disallow useApi to call
		if (!query) {
			return null;
		}

		return {
			query,
		};
	});

	const {
		status,
		data,
		reload,
	} = useApi<SearchGlobalRequest, SearchGlobalResponse>('search/global', request, false, "POST");

	const users = computed(() => {
		return data.value?.users ?? [];
	})
	const lists = computed(() => {
		return data.value?.lists ?? [];
	});

	return {
		searchStatus: status,

		users,
		lists,

		reload,
	};
}
