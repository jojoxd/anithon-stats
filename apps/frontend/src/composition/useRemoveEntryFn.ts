import {useAxios} from "./useAxios";
import { get, MaybeRef } from "@vueuse/core";
import {AnilistId, ListRemoveEntryRequest} from "@anistats/shared";

export function useRemoveEntryFn(listId: MaybeRef<string>)
{
    const axiosInstance = useAxios();

    return async function removeEntry(anilistId: MaybeRef<AnilistId>)
    {
        const _listId = get(listId);

        const request: ListRemoveEntryRequest = {
            anilistId: get(anilistId)
        };

        const response = await axiosInstance.delete<ListRemoveEntryRequest>(`/list/${_listId}/entries/remove`, {
            data: request
        });

        return response.status < 400;
    }
}