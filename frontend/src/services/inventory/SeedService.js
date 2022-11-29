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
        .get('/api/inventory/seeds?' + queryParams)
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
    return axios.get('/api/inventory/seeds/' + id).then(res => res.data)
}

const getFilters = () => {
    return axios.get('/api/inventory/seeds/filters').then(res => res.data)
}

const getTypes = () => {
    return axios.get('/api/inventory/seeds/types').then(res => res.data)
}

const addVariety = async (id, data) => {
    return await axios.post(`/api/inventory/seeds/types`, {
        kingdom: 'plant',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = id => {
    return axios
        .get('/api/inventory/seeds/' + id + '/similar')
        .then(res => res.data)
}

export default {
    getItem,
    getTypes,
    getList,
    getFilters,
    getSimilarItems,
    addVariety,
}
