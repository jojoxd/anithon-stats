import {useApi} from "./useApi";
import {IMetadata} from "@anistats/shared";
import { ref, reactive, Ref, computed } from "vue";
import { MaybeRef, get } from "@vueuse/core";
import {useAxios} from "./useAxios";

/**
 * Creates a wrapper to manage Metadata for a User List.
 *
 * @TODO: Change to useSavedData
 */
export function useSavedData(listId: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _listId = get(listId);

        if(!_listId)
            return false;

        return `list/${_listId}/savedData`;
    });

    const api = useApi<void, IMetadata>(endpoint, ref());
    const axiosInstance = useAxios();
    const metadata = reactive(api.data);

    async function updateSavedData()
    {
        const _endpoint = get(endpoint);

        // Invalid endpoint
        if(_endpoint === false)
            return;

        const response = await axiosInstance.put(_endpoint, {
            data: metadata.value
        });

        console.info(`PUT ${_endpoint}`, metadata.value);

        return response.status;
    }

    return {
        ...api,

        data: metadata as Ref<IMetadata | null>,
        updateSavedData,
    };
}
