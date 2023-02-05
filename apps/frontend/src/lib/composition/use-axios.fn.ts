import {get} from "@vueuse/core";
import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {computed, ComputedRef, readonly, Ref, ref, watch, WatchSource} from "vue";

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
    reload(): void;
    reset(): void;

    isLoading: ComputedRef<boolean>;

    hasErrors: ComputedRef<boolean>;

    error: ComputedRef<HttpError | AxiosError | Error | null>;

    value: Readonly<Ref<T>>;
}

export interface WrapAxiosOptions
{
    immediate?: boolean;
    watch?: WatchSource[];
}

export class HttpError extends Error
{
    public readonly statusCode: number;
    public readonly data?: unknown;

    constructor(message: string, statusCode: number, data?: unknown) {
        super(message);

        this.name = "HttpError";
        this.statusCode = statusCode;
        this.data = data;

        // NOTE: Proto chain would be incorrect, this fixes it
        Object.setPrototypeOf(this, new.target.prototype);
        if ('captureStackTrace' in Error) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export function wrapAxios<T, D = void>(fn: (axiosInstance: AxiosInstance) => Promise<AxiosResponse<T, D> | null>, options?: WrapAxiosOptions): WrapAxios<T | null>
{
    const isLoading = ref<boolean>(false);
    const error = ref<HttpError | AxiosError | Error | null>(null);
    const internalValue = ref<D | null>(null);

    async function load(): Promise<void>
    {
        isLoading.value = true;

        try {
            const response = await fn(useAxios());

            console.log({response});

            if (response === null) {
                internalValue.value = null;
                return;
            }

            if (response.status >= 400) {
                error.value = new HttpError(response.statusText, response.status, response.data);
            }

            internalValue.value = response.data ?? null;

            return;
        } catch(e) {
            if (e instanceof Error) {
                error.value = e;
            } else {
                console.warn('Unhandled Error', e);
            }
        } finally {
            isLoading.value = false;
        }

        // If all else fails, return null
        internalValue.value = null;
    }

    if (options?.immediate ?? true) {
        load();
    }

    if (options?.watch) {
        watch(options.watch, load);
    }

    return {
        reload: () => load(),
        reset: () => internalValue.value = null,

        isLoading: computed(() => get(isLoading)),

        hasErrors: computed(() => get(error) !== null),
        error: computed(() => get(error)),

        value: computed(() => get(internalValue)),
    }
}
