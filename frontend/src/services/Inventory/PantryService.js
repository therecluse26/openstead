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
        .get('/api/inventory/pantry?' + queryParams)
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
    return axios.get('/api/inventory/pantry/' + id).then(res => res.data)
}

const createOrUpdate = async (id, data, images = []) => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/pantry`
            : `/api/inventory/pantry/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        name: data.name,
        description: data.description,
        storage_type: data.storage_type,
        variety_id: data.variety_id,
        quantity: data.quantity,
        unit: data.unit,
        unit_amount: data.unit_amount,
        shelf_life_months: data.shelf_life_months,
        expiration_date: data.expiration_date,
        images: images,
    })
}

const getFilters = () => {
    return axios.get('/api/inventory/pantry/filters').then(res => res.data)
}

const getTypes = () => {
    return axios.get('/api/inventory/pantry/types').then(res => res.data)
}

const addVariety = async (id, data) => {
    return await axios.post(`/api/inventory/pantry/types`, {
        group: data?.group ?? '',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = id => {
    return axios
        .get('/api/inventory/pantry/' + id + '/similar')
        .then(res => res.data)
}

export default {
    getItem,
    getTypes,
    getList,
    getFilters,
    getSimilarItems,
    addVariety,
    createOrUpdate,
}
