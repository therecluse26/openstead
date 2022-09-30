import axios from '@/lib/axios'

export class EquipmentService {
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
            .get('/api/inventory/equipment?' + queryParams)
            .then(res => res.data)
    }

    getItem(id) {
        return axios.get('/api/inventory/equipment/' + id).then(res => res.data)
    }

    getTypes() {
        return axios.get('/api/inventory/equipment/types').then(res => res.data)
    }
}
