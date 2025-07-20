import axios, { AxiosResponse } from '@/lib/axios'
import {
    Equipment,
    InventoryListParams,
    InventoryListResponse,
} from '@/types/Inventory'
import { Service, ServiceLogFormData } from '@/types/Service'
import { ApiResponse, FilterOptions } from '@/types/Common'

interface EquipmentFormData {
    name: string
    type: string
    quantity: number
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
    rating?: number
    description?: string
    acquired_at?: string
    url?: string
}

interface ServiceFormData {
    type: string
    title: string
    description?: string
}

const getList = async (
    params?: InventoryListParams,
): Promise<InventoryListResponse> => {
    const queryParams = params
        ? Object.keys(params)
              .map(
                  k =>
                      encodeURIComponent(k) +
                      '=' +
                      encodeURIComponent(
                          params[k as keyof InventoryListParams] as string,
                      ),
              )
              .join('&')
        : ''
    return await axios
        .get(`/api/inventory/equipment?${queryParams}`)
        .then((res: AxiosResponse<InventoryListResponse>) => res.data)
}

const getItem = async (id: string): Promise<ApiResponse<Equipment>> => {
    return await axios
        .get(`/api/inventory/equipment/${id}`)
        .then((res: AxiosResponse<ApiResponse<Equipment>>) => res.data)
}

const getSimilarItems = async (
    id: string,
): Promise<ApiResponse<Equipment[]>> => {
    return await axios
        .get(`/api/inventory/equipment/${id}/similar`)
        .then((res: AxiosResponse<ApiResponse<Equipment[]>>) => res.data)
}

const getFilters = async (): Promise<ApiResponse<FilterOptions>> => {
    return await axios
        .get('/api/inventory/equipment/filters')
        .then((res: AxiosResponse<ApiResponse<FilterOptions>>) => res.data)
}

const createOrUpdate = async (
    id: string | undefined,
    data: EquipmentFormData,
    images: File[] = [],
): Promise<AxiosResponse> => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/equipment`
            : `/api/inventory/equipment/${id}`
    return await axios.post(url, {
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        condition: data.condition,
        rating: data.rating,
        description: data.description,
        acquired_at: data.acquired_at,
        url: data.url,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        images: images,
    })
}

const deleteItem = async (id: string): Promise<AxiosResponse> => {
    return await axios.post(`/api/inventory/equipment/${id}`, {
        _method: 'DELETE',
    })
}

const addServiceLog = async (
    id: string,
    data: ServiceLogFormData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/services/logs`, {
        serviceable_type: 'equipment',
        serviceable_id: id,
        type: data.service_id,
        notes: data.notes,
        service_date: data.performed_at,
        service_id: data.service_id,
        _method: 'POST',
    })
}

const addService = async (
    id: string,
    data: ServiceFormData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/services`, {
        type: data.type,
        title: data.title,
        description: data.description,
        _method: 'POST',
    })
}

export default {
    getItem,
    getList,
    getSimilarItems,
    createOrUpdate,
    addServiceLog,
    addService,
    deleteItem,
    getFilters,
}
