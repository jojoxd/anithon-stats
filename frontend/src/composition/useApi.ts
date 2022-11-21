import { ComputedRef, computed, Ref, ref, watch, isRef } from "vue";
import {useAxios} from "./useAxios";
import {AxiosError, Method} from "axios";
import {MaybeRef, get} from "@vueuse/core";

/**
 * Creates a data wrapper for using the API while conforming to Vue Reactivity.
 */
export function useApi<TData = undefined, TReturn = any>(endpoint: MaybeRef<string | false>, data: Ref<TData | null>, immediate: boolean = true, method: Method = "GET"): IUseApiReturnData<TReturn>
{
    const axiosInstance = useAxios();

    const returnData: Ref<TReturn | null> = ref(null);
    const responseStatus: Ref<number | null> = ref(null);
    const status: Ref<ApiStatus> = ref(ApiStatus.Initial);

    let _initial = true;

    let abortController: AbortController | null = null;

    async function execute(_status: ApiStatus)
    {
        // Abort previous request if it exists
        abortController?.abort();

        const _endpoint = get(endpoint);
        const _data = get(data);

        // Endpoint is invalid
        if(_endpoint === false)
            return;

        // Invalid Data
        if(_data === null)
            return;

        abortController = new AbortController();
        status.value = _initial ? ApiStatus.Fetching : _status;
        _initial = false;

        // @NOTE: Only POST & PUT methods are assigned as using Body
        const isBodyMethod = ["post", "put"].includes(method.toLowerCase());

        try {
            let response = await axiosInstance.request<TReturn>({
                url: _endpoint,
                method,
                [isBodyMethod ? 'data' : 'params']: _data,
                signal: abortController.signal,

            });

            returnData.value = response.data;
            responseStatus.value = response.status;

            status.value = (response.status >= 200 && response.status < 400) ? ApiStatus.Ok : ApiStatus.Failure;
        } catch(e) {
            if(isAxiosError<TData, TReturn>(e)) {
                responseStatus.value = e.response?.status ?? null;
            }

            status.value = ApiStatus.Failure;
        }
    }

    function isAxiosError<TData, TRet>(error: any): error is AxiosError
    {
        return (error as AxiosError<TData, TRet>).isAxiosError !== undefined;
    }

    watch(data, async () => {
        await execute(ApiStatus.Reloading);
    }, { immediate });

    if(isRef(endpoint)) {
        watch(endpoint, async () => {
            await execute(ApiStatus.Reloading);
        });
    }

    return {
        data: returnData,
        responseStatus: computed(() => responseStatus.value),
        status: computed(() => status.value),

        reload: async () => execute(ApiStatus.Reloading),

        cancel: () => abortController?.abort(),
    };
}

export interface IUseApiReturnData<TReturn>
{
    data: Ref<TReturn | null>,

    responseStatus: ComputedRef<number | null>;

    status: ComputedRef<ApiStatus>;

    reload: () => Promise<void>;

    cancel: () => void;
}

export enum ApiStatus
{
    Initial = "initial",
    Fetching = "fetching",
    Ok = "ok",
    Failure = "failure",
    Reloading = "reloading",
}
