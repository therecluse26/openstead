import axios from '@/lib/axios'

export class EquipmentService {
    getEquipmentList(params) {
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

    getEquipmentItem() {
        return axios.get('/api/inventory/equipment').then(res => res.data)
    }
}
