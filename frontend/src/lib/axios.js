import Axios from 'axios'

// Check if process.env.NEXT_PUBLIC_BACKEND_URL is defined
const isBackendUrlDefined = process?.env?.NEXT_PUBLIC_BACKEND_URL

// I can't figure out how to get the backend URL from the
// environment variable when running as a static site
const backendUrl = isBackendUrlDefined
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'https://api.openstead.app'

let headers = {
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

// Get Tenant ID from localstorage
const tenantId =
    typeof localStorage !== 'undefined'
        ? localStorage.getItem('tenantId')
        : null

if (tenantId) {
    headers['X-Tenant'] = tenantId
}

const axios = Axios.create({
    baseURL: backendUrl,
    headers: headers,
    withCredentials: true,
})

export default axios
