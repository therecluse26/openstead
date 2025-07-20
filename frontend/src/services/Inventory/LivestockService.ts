import axios, { AxiosResponse } from '@/lib/axios'
import {
    Livestock,
    InventoryListParams,
    InventoryListResponse,
} from '@/types/Inventory'
import { ApiResponse, FilterOptions } from '@/types/Common'

interface LivestockFormData {
    name: string
    description?: string
    variety_id?: string
    sex: 'male' | 'female' | 'unknown'
    date_of_birth?: string
    date_of_death?: string
    acquired_at?: string
    quantity: number
    parents?: string[]
    children?: string[]
}

interface BreedFormData {
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
        .get(`/api/inventory/livestock?${queryParams}`)
        .then((res: AxiosResponse<InventoryListResponse>) => res.data)
        .catch(function (e: any) {
            console.error('Error fetching livestock:', e)
        })
}

const getItem = (id: string): Promise<ApiResponse<Livestock>> => {
    return axios
        .get(`/api/inventory/livestock/${id}`)
        .then((res: AxiosResponse<ApiResponse<Livestock>>) => res.data)
}

const createOrUpdate = async (
    id: string | undefined,
    data: LivestockFormData,
    images: File[] = [],
): Promise<AxiosResponse> => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/livestock`
            : `/api/inventory/livestock/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',

        name: data.name,
        description: data.description,
        variety_id: data.variety_id,
        sex: data.sex,
        date_of_birth: data.date_of_birth,
        date_of_death: data.date_of_death,
        acquired_at: data.acquired_at,
        quantity: data.quantity,

        parents: data.parents,
        children: data.children,
        images: images,
    })
}

const deleteItem = async (id: string): Promise<AxiosResponse> => {
    return await axios.post(`/api/inventory/livestock/${id}`, {
        _method: 'DELETE',
    })
}

const markDeceased = async (id: string): Promise<AxiosResponse> => {
    return axios.post(`/api/inventory/livestock/${id}/deceased`)
}

const getFilters = (): Promise<ApiResponse<FilterOptions>> => {
    return axios
        .get('/api/inventory/livestock/filters')
        .then((res: AxiosResponse<ApiResponse<FilterOptions>>) => res.data)
}

const addBreed = async (
    id: string,
    data: BreedFormData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/inventory/livestock/types`, {
        group: 'animal',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = (id: string): Promise<ApiResponse<Livestock[]>> => {
    return axios
        .get(`/api/inventory/livestock/${id}/similar`)
        .then((res: AxiosResponse<ApiResponse<Livestock[]>>) => res.data)
}

export default {
    getItem,
    getFilters,
    getList,
    getSimilarItems,
    addBreed,
    createOrUpdate,
    deleteItem,
    markDeceased,
}
