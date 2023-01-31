import {asyncComputed, get} from "@vueuse/core";
import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
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

    hasErrors: ComputedRef<boolean>;

    error: ComputedRef<HttpError | AxiosError | Error | null>;

    value: Ref<T>;
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

export function wrapAxios<T>(fn: (axiosInstance: AxiosInstance) => Promise<AxiosResponse<T>>): WrapAxios<T | null>
{
    const reloadCounter = ref<number>(0);
    const isLoading = ref<boolean>(false);
    const error = ref<HttpError | AxiosError | Error | null>(null);

    return {
        reload: () => reloadCounter.value += 1,

        isLoading: computed(() => get(isLoading)),

        hasErrors: computed(() => get(error) !== null),
        error: computed(() => get(error)),

        value: asyncComputed<T>(async () => {
            isLoading.value = true;
            // @HACK: Reload uses vue's side-effects to re-run
            get(reloadCounter);

            try {
                const response = await fn(useAxios());

                if (response.status >= 400) {
                    error.value = new HttpError(response.statusText, response.status, response.data);
                }

                return response.data ?? null;
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
            return null;
        }),
    }
}
