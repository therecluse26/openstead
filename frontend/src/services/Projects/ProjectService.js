import axios from '@/lib/axios'
import { slugify } from '@/utils/string-utils'

const getList = async params => {
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
    return await axios.get('/api/projects?' + queryParams).then(res => res.data)
}

const getProject = async id => {
    return await axios.get('/api/projects/' + id).then(res => res.data)
}

const updateItems = async (id, items) => {
    return await axios.put(`/api/projects/${id}/items`, {
        items: items.map(item => {
            return {
                id: item.id,
                project_item_status_id: item.status.id,
            }
        }),
    })
}

const createOrUpdate = async (id, data, images = []) => {
    const url =
        typeof id === 'undefined' ? `/api/projects` : `/api/projects/${id}`
    return await axios.post(url, {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        images: images,
    })
}

const deleteItem = async id => {
    return await axios.post(`/api/projects/${id}`, {
        _method: 'DELETE',
    })
}

export default {
    getProject,
    getList,
    createOrUpdate,
    updateItems,
    deleteItem,
}
