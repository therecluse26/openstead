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

    getItem(id) {
        return axios.get('/api/inventory/livestock/' + id).then(res => res.data)
    }

    getTypes() {
        return axios.get('/api/inventory/livestock/types').then(res => res.data)
    }
}
