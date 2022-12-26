import {useDebounce, get} from "@vueuse/core";
import {computed, Ref} from "vue";
import {useApi} from "./useApi";
import {SearchRequest, SearchResponse} from "@anistats/shared";

export function useSearch(query: Ref<string>)
{
	const debouncedQuery = useDebounce(query, 250);

	const request = computed<SearchRequest | null>(() => {
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
	} = useApi<SearchRequest, SearchResponse>('search', request, false, "POST");

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
