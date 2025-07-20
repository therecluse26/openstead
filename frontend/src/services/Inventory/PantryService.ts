import axios, { AxiosResponse } from '@/lib/axios'
import {
    PantryItem,
    InventoryListParams,
    InventoryListResponse,
    InventoryType,
} from '@/types/Inventory'
import { ApiResponse, FilterOptions } from '@/types/Common'

interface PantryFormData {
    name: string
    description?: string
    storage_type: string
    variety_id?: string
    quantity: number
    unit: string
    unit_amount?: number
    shelf_life_months?: number
    expiration_date?: string
}

interface VarietyFormData {
    group?: string
    type: string
    title: string
    description?: string
}

const getList = (
    params?: InventoryListParams,
): Promise<InventoryListResponse | void> => {
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
    return axios
        .get(`/api/inventory/pantry?${queryParams}`)
        .then((res: AxiosResponse<InventoryListResponse>) => res.data)
        .catch(function (e: any) {
            console.error('Error fetching pantry items:', e)
        })
}

const getItem = (id: string): Promise<ApiResponse<PantryItem>> => {
    return axios
        .get(`/api/inventory/pantry/${id}`)
        .then((res: AxiosResponse<ApiResponse<PantryItem>>) => res.data)
}

const createOrUpdate = async (
    id: string | undefined,
    data: PantryFormData,
    images: File[] = [],
): Promise<AxiosResponse> => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/pantry`
            : `/api/inventory/pantry/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        name: data.name,
        description: data.description,
        storage_type: data.storage_type,
        variety_id: data.variety_id,
        quantity: data.quantity,
        unit: data.unit,
        unit_amount: data.unit_amount,
        shelf_life_months: data.shelf_life_months,
        expiration_date: data.expiration_date,
        images: images,
    })
}

const getFilters = (): Promise<ApiResponse<FilterOptions>> => {
    return axios
        .get('/api/inventory/pantry/filters')
        .then((res: AxiosResponse<ApiResponse<FilterOptions>>) => res.data)
}

const getTypes = (): Promise<ApiResponse<InventoryType[]>> => {
    return axios
        .get('/api/inventory/pantry/types')
        .then((res: AxiosResponse<ApiResponse<InventoryType[]>>) => res.data)
}

const addVariety = async (
    id: string,
    data: VarietyFormData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/inventory/pantry/types`, {
        group: data?.group ?? '',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = (id: string): Promise<ApiResponse<PantryItem[]>> => {
    return axios
        .get(`/api/inventory/pantry/${id}/similar`)
        .then((res: AxiosResponse<ApiResponse<PantryItem[]>>) => res.data)
}

export default {
    getItem,
    getTypes,
    getList,
    getFilters,
    getSimilarItems,
    addVariety,
    createOrUpdate,
}
