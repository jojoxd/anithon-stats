import { ComputedRef, computed, Ref, ref, watch } from "vue";
import {useAxios} from "./useAxios";

/**
 * Creates a data wrapper for using the API while conforming to Vue Reactivity.
 */
export function useApi<TData = undefined, TReturn = any>(endpoint: string, data: Ref<TData>, immediate: boolean = true): IUseApiReturnData<TReturn>
{
    const axiosInstance = useAxios();

    const returnData: Ref<TReturn | null> = ref(null);
    const responseStatus: Ref<number | null> = ref(null);
    const status: Ref<ApiStatus> = ref(ApiStatus.Initial);

    let _initial = true;

    async function execute(_status: ApiStatus)
    {
        status.value = _initial ? ApiStatus.Fetching : _status;
        _initial = false;

        try {
            let response = await axiosInstance.get<TReturn>(endpoint, {
                params: data.value,
            });

            returnData.value = response.data;
            responseStatus.value = response.status;

            status.value = (response.status >= 200 && response.status < 400) ? ApiStatus.Ok : ApiStatus.Failure;
        } catch(e) {
            status.value = ApiStatus.Failure;
        }
    }

    watch(data, async () => {
        await execute(ApiStatus.Reloading);
    }, { immediate });

    return {
        data: returnData,
        responseStatus: computed(() => responseStatus.value),
        status: computed(() => status.value),

        reload: async () => execute(ApiStatus.Reloading),
    };
}

export interface IUseApiReturnData<TReturn>
{
    data: Ref<TReturn | null>,

    responseStatus: ComputedRef<number | null>;

    status: ComputedRef<ApiStatus>;

    reload: () => Promise<void>;
}

export enum ApiStatus
{
    Initial = "initial",
    Fetching = "fetching",
    Ok = "ok",
    Failure = "failure",
    Reloading = "reloading",
}
