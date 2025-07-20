import axios, { AxiosResponse } from '@/lib/axios'
import { ServiceLog, ServiceLogFormData } from '@/types/Service'
import { ApiResponse } from '@/types/Common'

interface ServiceLogData {
    serviceable_type: string
    type: string
    notes?: string
    service_date: string
    service_id: string
}

interface ServiceData {
    type: string
    title: string
    description?: string
}

const getServiceLogs = (): void => {
    // Empty implementation as in original
}

const addServiceLog = async (
    id: string,
    data: ServiceLogData,
): Promise<AxiosResponse> => {
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

const addService = async (
    id: string,
    data: ServiceData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/services`, {
        type: data.type,
        title: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const deleteServiceLog = async (id: string): Promise<AxiosResponse | void> => {
    if (confirm('Are you sure you want to delete this service log?')) {
        return await axios.delete(`/api/services/logs/${id}`)
    }
}

export default {
    getServiceLogs,
    addServiceLog,
    addService,
    deleteServiceLog,
}
