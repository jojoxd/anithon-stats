import {useApi} from "./useApi";
import {IMetadata} from "@anistats/shared";
import { ref, reactive, Ref } from "vue";
import {useAxios} from "./useAxios";

export function useMetadata(user: string, list: string)
{
    const api = useApi<void, IMetadata>(`${user}/list/${list}/metadata`, ref());
    const axiosInstance = useAxios();
    const metadata = reactive(api.data);

    async function updateMetadata()
    {
        const response = await axiosInstance.post(`${user}/list/${list}/metadata`, {
            data: metadata.value
        });

        console.info(`POST /api/${user}/list/${list}/save`, metadata.value);

        return response.status;
    }

    return {
        ...api,

        data: metadata as Ref<IMetadata | null>,
        updateMetadata,
    };
}
