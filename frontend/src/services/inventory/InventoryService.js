import axios from '@/lib/axios'

const getItem = id => {
    return axios.get('/api/inventory/base/' + id).then(res => res.data)
}

const getTypes = () => {
    return axios.get('/api/inventory/base/types').then(res => res.data)
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
    return axios.get('/api/inventory/base?' + queryParams).then(res => res.data)
}

export default { getItem, getTypes, getList }
