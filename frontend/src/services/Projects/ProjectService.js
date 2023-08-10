import axios from '@/lib/axios'

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

const getItem = async id => {
    return await axios.get('/api/projects/' + id).then(res => res.data)
}

const getProject = async id => {
    return await axios.get('/api/projects/' + id).then(res => res.data)
}

const getProjectItem = async (projectId, itemId) => {
    return await axios
        .get(`/api/projects/${projectId}/items/${itemId}`)
        .then(res => res.data)
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

const createOrUpdate = async (id, data) => {
    const url =
        typeof id === 'undefined' ? `/api/projects` : `/api/projects/${id}`

    return await axios.post(url, {
        name: data.name,
        description: data.description,
        users: data.users,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
    })
}

const createItem = async (projectId, data) => {
    const url = `/api/projects/${projectId}/items`

    return await axios.post(url, {
        title: data.title,
        description: data.description,
        project_item_status_id: data.project_item_status_id,
        due_date: data.due_date,
        creator_id: data.creator_id,
        assignee_id: data.assignee_id,
        _method: 'POST',
    })
}

const deleteItem = async id => {
    return await axios.post(`/api/projects/${id}`, {
        _method: 'DELETE',
    })
}

const deleteProject = async id => {
    return await axios.post(`/api/projects/${id}`, {
        _method: 'DELETE',
    })
}

export default {
    getProject,
    getProjectItem,
    getList,
    getItem,
    createOrUpdate,
    createItem,
    updateItems,
    deleteItem,
    deleteProject,
}
