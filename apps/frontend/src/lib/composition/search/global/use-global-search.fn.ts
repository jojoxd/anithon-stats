import { get } from "@vueuse/core";
import {wrapAxios} from "../../use-axios.fn";
import {SearchGlobalRequest, SearchGlobalResponse} from "@anistats/shared";
import {computed, Ref } from "vue";

export function useGlobalSearch(query: Ref<string | null>)
{
    const {
        reload,
        isLoading,
        value: response,
    } = wrapAxios((axios) => {
        return axios.get<SearchGlobalRequest, SearchGlobalResponse>(
            'search/global',
            {
                data: {
                    query: get(query),
                },
            }
        );
    });

    const users = computed(() => {
        const _response = get(response);

        return _response?.users ?? null;
    });

    const lists = computed(() => {
        const _response = get(response);

        return _response?.lists ?? null;
    });

    return {
        reload,
        isLoading,

        users,
        lists,
    };
}
