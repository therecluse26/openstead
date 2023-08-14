import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'https://api.openstead.app', // I can't figure out how to get the backend URL from the environment variable when running statically
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Max-Age': 'public, max-age=7200',
        'Access-Control-Allow-Origin': 'https://api.openstead.app',
        Vary: 'origin',
    },
    withCredentials: true,
})

export default axios
