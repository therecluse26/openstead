import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Max-Age': 'public, max-age=7200',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_BACKEND_URL,
        Vary: 'origin',
    },
    withCredentials: true,
})

export default axios
