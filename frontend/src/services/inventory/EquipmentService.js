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

export default { getItem, getTypes, getList, getSimilarItems }
