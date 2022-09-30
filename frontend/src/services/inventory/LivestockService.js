import axios from '@/lib/axios'

export class LivestockService {
    getList(params) {
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
    }

    getItem() {
        return axios.get('/api/inventory/livestock').then(res => res.data)
    }

    getTypes() {
        return axios.get('/api/inventory/livestock/types').then(res => res.data)
    }
}
