import {ComputedRef, Ref} from "vue";
import { get } from "@vueuse/core";
import { wrapAxios } from "../../use-axios.fn";
import { computedExtract } from "../../../util/computed-extract.fn";
import {
    SearchGlobalRequest, SearchGlobalResponse,
    SearchGlobalUserDto, SearchGlobalListDto,
} from "@anistats/shared";

interface UseGlobalSearch
{
    reload(): void;
    isLoading: ComputedRef<boolean>;

    users: ComputedRef<Array<SearchGlobalUserDto> | null>;
    lists: ComputedRef<Array<SearchGlobalListDto> | null>;
}

export function useGlobalSearch(query: Ref<string | null>): UseGlobalSearch
{
    const {
        reload,
        isLoading,
        value: response,
    } = wrapAxios<SearchGlobalResponse, SearchGlobalRequest>((axios) => {
        return axios.get(
            'search/global',
            {
                data: {
                    query: get(query),
                },
            }
        );
    });

    const users = computedExtract(response, (response) => response?.users ?? null);
    const lists = computedExtract(response, (response) => response?.lists ?? null);

    return {
        reload,
        isLoading,

        users,
        lists,
    };
}
