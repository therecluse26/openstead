import axios from '@/lib/axios'
import { useRef } from 'react'

const Toast = () => {
    return useRef(null)
}

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
        .get('/api/inventory/livestock?' + queryParams)
        .then(res => res.data)
        .catch(function (e) {
            Toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: e,
            })
        })
}

const getItem = id => {
    return axios.get('/api/inventory/livestock/' + id).then(res => res.data)
}

const createOrUpdate = async (id, data, images = []) => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/livestock`
            : `/api/inventory/livestock/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',

        name: data.name,
        description: data.description,
        variety_id: data.variety_id,
        sex: data.sex,
        date_of_birth: data.date_of_birth,
        date_of_death: data.date_of_death,
        acquired_at: data.acquired_at,
        quantity: data.quantity,

        parents: data.parents,
        children: data.children,
        images: images,
    })
}

const deleteItem = async id => {
    return await axios.post(`/api/inventory/livestock/${id}`, {
        _method: 'DELETE',
    })
}

const markDeceased = async id => {
    return axios.post(`/api/inventory/livestock/${id}/deceased`)
}

const getFilters = () => {
    return axios.get('/api/inventory/livestock/filters').then(res => res.data)
}

const addBreed = async (id, data) => {
    return await axios.post(`/api/inventory/livestock/types`, {
        group: 'animal',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = id => {
    return axios
        .get('/api/inventory/livestock/' + id + '/similar')
        .then(res => res.data)
}

export default {
    getItem,
    getFilters,
    getList,
    getSimilarItems,
    addBreed,
    createOrUpdate,
    deleteItem,
    markDeceased,
}
