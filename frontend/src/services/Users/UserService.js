import axios from '@/lib/axios'

export function getUsers() {
    return axios.get('/api/users').then(res => res.data)
}

export const getList = async params => {
    const queryParams = params
        ? Object.keys(params)
              .map(
                  k =>
                      encodeURIComponent(k) +
                      '=' +
                      encodeURIComponent(params[k]),
              )
              .join('&')
        : ''
    return await axios
        .get('/api/users/paginated?' + queryParams)
        .then(res => res.data)
}

export const getItem = async id => {
    return await axios.get(`/api/users/${id}`).then(res => res.data)
}

export const deleteItem = async id => {
    return await axios.delete(`/api/users/${id}`)
}

const createOrUpdate = async (id, data, images = []) => {
    const url = typeof id === 'undefined' ? `/api/users` : `/api/users/${id}`

    let postData = {
        name: data.name,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        images: images,
    }

    if (data?.password && data?.password_confirmation) {
        postData.password = data.password
        postData.password_confirmation = data.password_confirmation
    }

    return await axios.post(url, postData)
}

export default {
    getList,
    getUsers,
    getItem,
    deleteItem,
    createOrUpdate,
}
