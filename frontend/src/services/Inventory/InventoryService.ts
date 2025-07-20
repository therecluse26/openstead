import axios, { AxiosResponse } from '@/lib/axios'
import {
    InventoryBase,
    InventoryListParams,
    InventoryListResponse,
    InventoryType,
} from '@/types/Inventory'
import { ApiResponse } from '@/types/Common'

const getItem = (id: string): Promise<ApiResponse<InventoryBase>> => {
    return axios
        .get(`/api/inventory/base/${id}`)
        .then((res: AxiosResponse<ApiResponse<InventoryBase>>) => res.data)
}

const getTypes = (): Promise<ApiResponse<InventoryType[]>> => {
    return axios
        .get('/api/inventory/base/types')
        .then((res: AxiosResponse<ApiResponse<InventoryType[]>>) => res.data)
}

const getList = (
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
    return axios
        .get(`/api/inventory/base?${queryParams}`)
        .then((res: AxiosResponse<InventoryListResponse>) => res.data)
}

export default { getItem, getTypes, getList }
