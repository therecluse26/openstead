import axios from '@/lib/axios'

const getList = params => {
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
    return axios
        .get('/api/inventory/equipment?' + queryParams)
        .then(res => res.data)
}

const getItem = id => {
    return axios.get('/api/inventory/equipment/' + id).then(res => res.data)
}

const getSimilarItems = id => {
    return axios
        .get(`/api/inventory/equipment/${id}/similar`)
        .then(res => res.data)
}

const getTypes = () => {
    return axios.get('/api/inventory/equipment/types').then(res => res.data)
}

const createOrUpdate = (id, data, images = []) => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/equipment`
            : `/api/inventory/equipment/${id}`
    return axios.post(url, {
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        condition: data.condition,
        description: data.description,
        acquired_at: data.acquired_at,
        url: data.url,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        images: images,
    })
}

const addServiceLog = (id, data) => {
    return axios.post(`/api/inventory/equipment/${id}/add-service-log`, {
        type: data.type,
        notes: data.notes,
        service_date: data.service_date,
        service_id: data.service_id,
        _method: 'POST',
    })
}

const addService = (id, data) => {
    return axios.post(`/api/services`, {
        type: data.type,
        title: data.title,
        description: data.description,
        _method: 'POST',
    })
}

export default {
    getItem,
    getTypes,
    getList,
    getSimilarItems,
    createOrUpdate,
    addServiceLog,
    addService,
}
