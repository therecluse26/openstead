import axios from '@/lib/axios'

const getServiceLogs = () => {}

const addServiceLog = async (id, data) => {
    return await axios.post(`/api/services/logs`, {
        serviceable_type: data.serviceable_type,
        serviceable_id: id,
        type: data.type,
        notes: data.notes,
        service_date: data.service_date,
        service_id: data.service_id,
        _method: 'POST',
    })
}

const addService = async (id, data) => {
    return await axios.post(`/api/services`, {
        type: data.type,
        title: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const deleteServiceLog = async id => {
    return await axios.delete(`/api/services/logs/${id}`)
}

export default {
    getServiceLogs,
    addServiceLog,
    addService,
    deleteServiceLog,
}
