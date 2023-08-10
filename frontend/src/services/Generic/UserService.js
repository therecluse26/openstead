import axios from '@/lib/axios'

export function getUsers() {
    return axios.get('/api/users').then(res => res.data)
}
