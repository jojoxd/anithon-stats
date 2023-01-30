import {asyncComputed, get} from "@vueuse/core";
import axios, {AxiosInstance} from "axios";
import {computed, ComputedRef, Ref, ref} from "vue";

const getBaseUrl = (): string => {
    if(import.meta.env.DEV) {
        return '/api/'
    }

    return `${import.meta.env.BASE_URL}/api/`;
}

const axiosInstance = axios.create({
    baseURL: getBaseUrl(),

    // Don't throw on responses >=300
    validateStatus: () => true,
});

if(import.meta.env.DEV) {
    axiosInstance.interceptors.request.use(request => {
        console.log(`Axios: ${request.method} ${request.baseURL ?? '/'}${request.url}`);

        return request;
    });
}

/**
 * Creates an Axios Instance
 */
export function useAxios()
{
    return axiosInstance;
}

export interface WrapAxios<T>
{
    reload: () => void;

    isLoading: ComputedRef<boolean>;

    value: Ref<T>;
}

export function wrapAxios<T>(fn: (axiosInstance: AxiosInstance) => Promise<T>): WrapAxios<T>
{
    const reloadCounter = ref(0);
    const isLoading = ref(false);

    return {
        reload: () => reloadCounter.value += 1,

        isLoading: computed(() => isLoading.value),

        value: asyncComputed<T>(async () => {
            isLoading.value = true;
            // @HACK: Reload uses vue's side-effects to re-run
            get(reloadCounter);

            const data = await fn(useAxios());

            isLoading.value = false;
            return data;
        }),
    }
}
