import {ComputedRef, Ref, watch} from "vue";
import {get, useDebounce} from "@vueuse/core";
import { wrapAxios } from "../../use-axios.fn";
import { computedExtract } from "../../../util/computed-extract.fn";
import {SearchAnimeRequest, SearchAnimeResponse, SeriesDto} from "@anistats/shared";

interface UseSeriesSearch
{
    reload(): void;
    reset(): void;

    isLoading: ComputedRef<boolean>;

    series: ComputedRef<Array<SeriesDto> | null>;
}

export function useSeriesSearch(query: Ref<string | null>): UseSeriesSearch
{
    const debouncedQuery = useDebounce(query, 250);

    const {
        reload,
        reset,
        isLoading,
        value: response,
    } = wrapAxios<SearchAnimeResponse, SearchAnimeRequest>(async (axios) => {
        const _query = get(debouncedQuery);

        if (_query === '' || _query === null) {
            return null;
        }

        return axios.post(
            'search/anime',
            {
                query: _query,
            },
        );
    }, {
        immediate: false,
        watch: [
            debouncedQuery,
        ],
    });

    watch(response, () => {
        console.log(response.value);
    });

    const series = computedExtract(response, (response) => response?.series ?? null);

    return {
        reload,
        reset,
        isLoading,

        series,
    };
}
