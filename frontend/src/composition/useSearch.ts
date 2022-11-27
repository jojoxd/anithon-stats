import {useDebounce, get} from "@vueuse/core";
import {computed, readonly, Ref} from "vue";
import {useApi} from "./useApi";
import {ISearchRequest, ISearchResponse} from "@anistats/shared";

export function useSearch(query: Ref<string>)
{
	const debouncedQuery = useDebounce(query, 250);

	const request = computed<ISearchRequest | null>(() => {
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
	} = useApi<ISearchRequest, ISearchResponse>('search', request, false, "POST");

	return {
		searchStatus: status,
		searchData: readonly(data),

		reload,
	};
}
