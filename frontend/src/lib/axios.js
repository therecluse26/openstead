import Axios from 'axios'

// Check if process.env.NEXT_PUBLIC_BACKEND_URL is defined
const isBackendUrlDefined = process?.env?.NEXT_PUBLIC_BACKEND_URL

// I can't figure out how to get the backend URL from the
// environment variable when running as a static site
const backedUrl = isBackendUrlDefined
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'https://api.openstead.app'

const axios = Axios.create({
    baseURL: backedUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Max-Age': 'public, max-age=7200',
        'Access-Control-Allow-Origin': backedUrl,
        Vary: 'origin',
    },
    withCredentials: true,
})

export default axios
