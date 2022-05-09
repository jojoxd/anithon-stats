import {useApi} from "./useApi";
import {IMetadata} from "@anistats/shared";
import { ref, reactive, Ref, computed } from "vue";
import { MaybeRef, get } from "@vueuse/core";
import {useAxios} from "./useAxios";

/**
 * Creates a wrapper to manage Metadata for a User List.
 */
export function useMetadata(user: MaybeRef<string>, list: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _user = get(user);
        const _list = get(list);

        if(!_user || !_list)
            return false;

        return `metadata/${_user}/${_list}`;
    });

    const api = useApi<void, IMetadata>(endpoint, ref());
    const axiosInstance = useAxios();
    const metadata = reactive(api.data);

    async function updateMetadata()
    {
        const _endpoint = get(endpoint);

        // Invalid endpoint
        if(_endpoint === false)
            return;

        const response = await axiosInstance.put(_endpoint, {
            data: metadata.value
        });

        console.info(`PUT /api/${user}/list/${list}/metadata`, metadata.value);

        return response.status;
    }

    return {
        ...api,

        data: metadata as Ref<IMetadata | null>,
        updateMetadata,
    };
}
