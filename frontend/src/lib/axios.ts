import Axios, { AxiosRequestConfig, AxiosError } from 'axios'

import { useTenantStore } from '@/components/Tenants/TenantStore'

// Check if process.env.NEXT_PUBLIC_BACKEND_URL is defined
const isBackendUrlDefined: string | undefined =
    process?.env?.NEXT_PUBLIC_BACKEND_URL

// I can't figure out how to get the backend URL from the
// environment variable when running as a static site
const backendUrl: string = isBackendUrlDefined
    ? (process.env.NEXT_PUBLIC_BACKEND_URL as string)
    : 'https://api.openstead.app'

const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Max-Age': 'public, max-age=7200',
    'Access-Control-Allow-Origin':
        backendUrl +
        ' ' +
        (typeof window !== 'undefined'
            ? window.location.origin + ' ' + window.location.hostname
            : '' + ' ' + ''),
    Vary: 'origin',
}

const axios = Axios.create({
    baseURL: backendUrl,
    headers: headers,
    withCredentials: true,
})

axios.interceptors.request.use(
    function (config: AxiosRequestConfig) {
        const tenantId = useTenantStore.getState()?.currentTenant?.id
        if (tenantId && config.headers) {
            config.headers['X-Tenant'] = tenantId
        }
        return config
    },
    function (error: AxiosError) {
        return Promise.reject(error)
    },
)

export default axios
