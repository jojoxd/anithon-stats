import {useApi} from "./useApi";
import {IMetadata} from "@anistats/shared";
import { ref, reactive, Ref, computed } from "vue";
import { MaybeRef, get } from "@vueuse/core";
import {useAxios} from "./useAxios";
import {IListMetadata} from "@anistats/shared/src/IListMetadata";

export function useListMetadata(user: MaybeRef<string>, list: MaybeRef<string>)
{
    const endpoint = computed(() => {
        const _user = get(user);
        const _list = get(list);

        if(!_user || !_list)
            return false;

        return `user/${_user}/lists/${_list}/metadata`;
    });

    const api = useApi<void, IListMetadata>(endpoint, ref());
    const axiosInstance = useAxios();

    const metadata = reactive(api.data);

    async function updateListMetadata()
    {
        const _endpoint = get(endpoint);

        // Invalid endpoint
        if(_endpoint === false)
            return;

        const response = await axiosInstance.put(_endpoint, {
            data: metadata.value,
        });

        console.info(`PUT ${_endpoint}`, metadata.value);

        return response.status;
    }

    return {
        ...api,

        data: metadata as Ref<IMetadata | null>,
        updateListMetadata,
    }
}
