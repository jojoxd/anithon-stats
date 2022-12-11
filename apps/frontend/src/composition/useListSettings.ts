import {useApi} from "./useApi";
import {IMetadata} from "@anistats/shared";
import { ref, reactive, Ref, computed } from "vue";
import { MaybeRef, get } from "@vueuse/core";
import {useAxios} from "./useAxios";
import {IListMetadata} from "@anistats/shared";

// @TODO: Change to useListSettings
export function useListSettings(listId: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _listId = get(listId);

        if(!_listId)
            return false;

        return `list/${_listId}/settings`;
    });

    const api = useApi<void, IListMetadata>(endpoint, ref());
    const axiosInstance = useAxios();

    const settings = reactive(api.data);

    async function updateListSettings()
    {
        const _endpoint = get(endpoint);

        // Invalid endpoint
        if(_endpoint === false)
            return;

        const response = await axiosInstance.put(_endpoint, {
            data: settings.value,
        });

        console.info(`PUT ${_endpoint}`, settings.value);

        return response.status;
    }

    return {
        ...api,

        listSettings: settings as Ref<IListMetadata | null>,
        updateListSettings,
    }
}
