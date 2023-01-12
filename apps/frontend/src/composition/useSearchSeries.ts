import {computed, readonly, Ref} from "vue";
import {get, useDebounce} from "@vueuse/core";
import {useApi} from "./useApi";
import {SearchAnimeRequest, SearchAnimeResponse} from "@anistats/shared";


export function useSearchSeries(query: Ref<string>)
{
    const debouncedQuery = useDebounce(query, 250);

    const request = computed<SearchAnimeRequest | null>(() => {
        const query = get(debouncedQuery);

        if(!query) {
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
    } = useApi<SearchAnimeRequest, SearchAnimeResponse>('search/anime', request, false, "POST");

    return {
        searchStatus: status,

        foundSeries: computed(() => {
            return data.value?.series ?? null;
        }),

        resetData: () => {
            data.value = null;
        },

        reload,
    };
}