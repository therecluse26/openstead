import axios, { AxiosResponse } from '@/lib/axios'
import {
    Seed,
    InventoryListParams,
    InventoryListResponse,
    InventoryType,
} from '@/types/Inventory'
import { ApiResponse, FilterOptions } from '@/types/Common'

interface SeedFormData {
    variety_id?: string
    quantity: number
    life_cycle?: string
    days_to_germination?: number
    days_to_maturity?: number
    planting_depth?: string
    plant_spacing?: string
    light_requirement?: string
    zone_lower?: number
    zone_upper?: number
    acquired_at?: string
    url?: string
}

interface VarietyFormData {
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
        .get(`/api/inventory/seeds?${queryParams}`)
        .then((res: AxiosResponse<InventoryListResponse>) => res.data)
        .catch(function (e: any) {
            console.error('Error fetching seeds:', e)
        })
}

const getItem = (id: string): Promise<ApiResponse<Seed>> => {
    return axios
        .get(`/api/inventory/seeds/${id}`)
        .then((res: AxiosResponse<ApiResponse<Seed>>) => res.data)
}

const createOrUpdate = async (
    id: string | undefined,
    data: SeedFormData,
    images: File[] = [],
): Promise<AxiosResponse> => {
    const url =
        typeof id === 'undefined'
            ? `/api/inventory/seeds`
            : `/api/inventory/seeds/${id}`
    return await axios.post(url, {
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',

        variety_id: data.variety_id,
        quantity: data.quantity,
        life_cycle: data.life_cycle,
        days_to_germination: data.days_to_germination,
        days_to_maturity: data.days_to_maturity,
        planting_depth: data.planting_depth,
        plant_spacing: data.plant_spacing,
        light_requirement: data.light_requirement,
        zone_lower: data.zone_lower,
        zone_upper: data.zone_upper,
        acquired_at: data.acquired_at,
        url: data.url,
        images: images,
    })
}

const getFilters = (): Promise<ApiResponse<FilterOptions>> => {
    return axios
        .get('/api/inventory/seeds/filters')
        .then((res: AxiosResponse<ApiResponse<FilterOptions>>) => res.data)
}

const getTypes = (): Promise<ApiResponse<InventoryType[]>> => {
    return axios
        .get('/api/inventory/seeds/types')
        .then((res: AxiosResponse<ApiResponse<InventoryType[]>>) => res.data)
}

const addVariety = async (
    id: string,
    data: VarietyFormData,
): Promise<AxiosResponse> => {
    return await axios.post(`/api/inventory/seeds/types`, {
        group: 'plant',
        group_type: data.type,
        variety_name: data.title,
        description: data.description,
        _method: 'POST',
    })
}

const getSimilarItems = (id: string): Promise<ApiResponse<Seed[]>> => {
    return axios
        .get(`/api/inventory/seeds/${id}/similar`)
        .then((res: AxiosResponse<ApiResponse<Seed[]>>) => res.data)
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
