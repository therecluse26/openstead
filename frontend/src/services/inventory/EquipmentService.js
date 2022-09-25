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

    getItem() {
        return axios.get('/api/inventory/equipment').then(res => res.data)
    }

    getTypes() {
        return axios.get('/api/inventory/equipment-types').then(res => res.data)
    }
}
