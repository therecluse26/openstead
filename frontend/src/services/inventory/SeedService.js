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

const createOrUpdate = async (id, data, images = []) => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/seeds`
            : `/api/inventory/seeds/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',

        variety_id: data.variety_id,
        quantity: data.quantity,
        life_cycle: data.life_cycle,
        days_to_germination: data.days_to_germination,
        days_to_maturity: data.days_to_maturity,
        planting_depth: data.planting_depth,
        plant_spacing: data.plant_spacing,
        light_requirement: data.light_requirement,
        zone_lower: data.zone_lower,
        zone_upper: data.zone_upper,
        acquired_at: data.acquired_at,
        url: data.url,
        images: images,
    })
}

const getFilters = () => {
    return axios.get('/api/inventory/seeds/filters').then(res => res.data)
}

const getTypes = () => {
    return axios.get('/api/inventory/seeds/types').then(res => res.data)
}

const addVariety = async (id, data) => {
    return await axios.post(`/api/inventory/seeds/types`, {
        group: 'plant',
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
