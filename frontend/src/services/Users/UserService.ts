import axios, { AxiosResponse } from '@/lib/axios'
import { User } from '@/types/User'
import { ApiResponse, PaginatedResponse } from '@/types/Common'

interface UserListParams {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_direction?: 'asc' | 'desc'
}

interface UserFormData {
    name: string
    email: string
    roles?: string[]
    permissions?: string[]
    current_password?: string
    password?: string
    password_confirmation?: string
}

export function getUsers(): Promise<ApiResponse<User[]>> {
    return axios
        .get('/api/users')
        .then((res: AxiosResponse<ApiResponse<User[]>>) => res.data)
}

export const getList = async (
    params?: UserListParams,
): Promise<PaginatedResponse<User>> => {
    const queryParams = params
        ? Object.keys(params)
              .map(
                  k =>
                      encodeURIComponent(k) +
                      '=' +
                      encodeURIComponent(
                          params[k as keyof UserListParams] as string,
                      ),
              )
              .join('&')
        : ''
    return await axios
        .get(`/api/users/paginated?${queryParams}`)
        .then((res: AxiosResponse<PaginatedResponse<User>>) => res.data)
}

export const getItem = async (id: string): Promise<ApiResponse<User>> => {
    return await axios
        .get(`/api/users/${id}`)
        .then((res: AxiosResponse<ApiResponse<User>>) => res.data)
}

export const deleteItem = async (id: string): Promise<AxiosResponse> => {
    return await axios.delete(`/api/users/${id}`)
}

const createOrUpdate = async (
    id: string | undefined,
    data: UserFormData,
    images: File[] = [],
): Promise<AxiosResponse> => {
    const url = typeof id === 'undefined' ? `/api/users` : `/api/users/${id}`

    let postData: any = {
        name: data.name,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
        images: images,
    }

    if (data?.password && data?.password_confirmation) {
        postData.current_password = data?.current_password
        postData.password = data.password
        postData.password_confirmation = data.password_confirmation
    }

    return await axios.post(url, postData)
}

export default {
    getList,
    getUsers,
    getItem,
    deleteItem,
    createOrUpdate,
}
