import { ListDto, ListId, ListResponse, UpdateListRequest, BaseResponse } from "@anistats/shared";
import { get } from "@vueuse/core";
import { AxiosResponse } from "axios";
import { ref, Ref, nextTick } from "vue";
import { useAxios } from "../../composition/use-axios.fn";

export interface UseListApi
{
    loadList(id: ListId): Promise<void>;

    saveList(): Promise<void>;

    hasUnsavedChanges: Ref<boolean>;
}

export function useListApi(currentList: Ref<ListDto | null>): UseListApi
{
    const axios = useAxios();

    const hasUnsavedChanges = ref<boolean>(false);

    async function loadList(id: ListId) {
        console.log('Load List', id);

        const response = await axios.get<ListResponse>(`list/${id}`);

        currentList.value = response.data?.list ?? null;

        await nextTick(() => {
            hasUnsavedChanges.value = false;
        });
    }

    async function saveList() {
        const _currentList = get(currentList);

        // @TODO: Throw error or smth
        if (!_currentList) {
            return;
        }

        const updateListRequest: UpdateListRequest = {
            id: _currentList.id,

            settings: _currentList.settings,

            data: _currentList.entries.data,

            entries: _currentList.entries.items,
        };

        // @TODO: Overlay
        const response = await axios.post<UpdateListRequest, AxiosResponse<BaseResponse>>('list/update', updateListRequest);

        response.data.message
    }

    return {
        loadList,
        saveList,

        hasUnsavedChanges,
    };
}