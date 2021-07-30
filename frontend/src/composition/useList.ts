import {useApi} from "./useApi";
import {ref} from "vue";

export function useList(id: any)
{
    const { data, responseStatus } = useApi<undefined, any>('/', ref());

    return { data, responseStatus };
}
