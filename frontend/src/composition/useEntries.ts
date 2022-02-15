import {useApi} from "./useApi";
import {ref} from "vue";
import {IEntry} from "@anistats/shared";

export function useEntries(user: string, list: string)
{
    return useApi<void, Array<IEntry>>(`${user}/list/${list}/entries`, ref());
}
