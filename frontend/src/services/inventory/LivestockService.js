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

const getTypes = () => {
    return axios.get('/api/inventory/livestock/types').then(res => res.data)
}

export default { getItem, getTypes, getList }
