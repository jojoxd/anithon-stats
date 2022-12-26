import {AnilistId, ListAddEntryRequest} from "@anistats/shared";
import { get, MaybeRef } from "@vueuse/core";
import {useAxios} from "./useAxios";

export function useAddEntryFn(listId: MaybeRef<string>)
{
    const axiosInstance = useAxios();

    return async function addEntry(anilistId: MaybeRef<AnilistId>)
    {
        const _listId = get(listId);

        const request: ListAddEntryRequest = {
            anilistId: get(anilistId)
        };

        const response = await axiosInstance.put<ListAddEntryRequest>(`/list/${_listId}/entries/add`, request);

        return response.status < 400;
    }
}