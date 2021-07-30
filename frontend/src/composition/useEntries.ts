import {useApi} from "./useApi";
import {reactive, ref} from "vue";
import {IEntry, ISavedData} from "@anistats/shared";
import {useAxios} from "./useAxios";

export function useEntries(user: string, list: string)
{
    const api = useApi<void, Array<IEntry>>(`${user}/list/${list}/entries`, ref());
    const axiosInstance = useAxios();

    async function updateSavedData()
    {
        /// @STUB
        /// @TODO: Change args to correct data structure

        const savedData: { [key: string]: ISavedData } = {};
        for(const entry of api.data.value!) {
            savedData[entry.id] = entry.savedData;
        }

        console.warn('TODO: Add updateSavedData function');

        // @ts-ignore
        console.info(`POST /api/${user}/list/${list}/save`, savedData);

        const response = await axiosInstance.post(`${user}/list/${list}/save`, {
            data: savedData,
        });

        return response.status;
    }

    return {
        ...api,

        data: reactive(api.data),

        updateSavedData,
    };
}
