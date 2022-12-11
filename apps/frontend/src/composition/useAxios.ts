import axios from "axios";

const getBaseUrl = (): string => {
    if(import.meta.env.DEV) {
        return '/api/'
    }

    return `${import.meta.env.BASE_URL}/api/`;
}

const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
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