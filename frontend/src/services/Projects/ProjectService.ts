import axios, { AxiosResponse } from '@/lib/axios'
import { Project, ProjectItem } from '@/types/Project'
import { User } from '@/types/User'
import { ApiResponse, PaginatedResponse } from '@/types/Common'

interface ProjectListParams {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_direction?: 'asc' | 'desc'
}

interface ProjectFormData {
    name: string
    description: string
    users?: User[]
}

interface ProjectItemFormData {
    title: string
    description: string
    project_item_status_id: string
    due_date?: string
    creator_id?: string
    assignee_id?: string
}

interface ProjectItemUpdate {
    id: string
    status: {
        id: string
    }
}

const getList = async (
    params?: ProjectListParams,
): Promise<PaginatedResponse<Project>> => {
    const queryParams = params
        ? Object.keys(params)
              .map(
                  k =>
                      encodeURIComponent(k) +
                      '=' +
                      encodeURIComponent(
                          params[k as keyof ProjectListParams] as string,
                      ),
              )
              .join('&')
        : ''
    return await axios
        .get(`/api/projects?${queryParams}`)
        .then((res: AxiosResponse<PaginatedResponse<Project>>) => res.data)
}

const getItem = async (id: string): Promise<ApiResponse<Project>> => {
    return await axios
        .get(`/api/projects/${id}`)
        .then((res: AxiosResponse<ApiResponse<Project>>) => res.data)
}

const getProject = async (id: string): Promise<ApiResponse<Project>> => {
    return await axios
        .get(`/api/projects/${id}`)
        .then((res: AxiosResponse<ApiResponse<Project>>) => res.data)
}

const getProjectItem = async (
    projectId: string,
    itemId: string,
): Promise<ApiResponse<ProjectItem>> => {
    return await axios
        .get(`/api/projects/${projectId}/items/${itemId}`)
        .then((res: AxiosResponse<ApiResponse<ProjectItem>>) => res.data)
}

const updateItems = async (
    id: string,
    items: ProjectItemUpdate[],
): Promise<AxiosResponse> => {
    return await axios.put(`/api/projects/${id}/items`, {
        items: items.map(item => {
            return {
                id: item.id,
                project_item_status_id: item.status.id,
            }
        }),
    })
}

const createOrUpdate = async (
    id: string | undefined,
    data: ProjectFormData,
): Promise<AxiosResponse> => {
    const url =
        typeof id === 'undefined' ? `/api/projects` : `/api/projects/${id}`

    return await axios.post(url, {
        name: data.name,
        description: data.description,
        users: data.users,
        _method: typeof id === 'undefined' ? 'POST' : 'PUT',
    })
}

const createItem = async (
    projectId: string,
    data: ProjectItemFormData,
): Promise<AxiosResponse> => {
    const url = `/api/projects/${projectId}/items`

    return await axios.post(url, {
        title: data.title,
        description: data.description,
        project_item_status_id: data.project_item_status_id,
        due_date: data.due_date,
        creator_id: data.creator_id,
        assignee_id: data.assignee_id,
        _method: 'POST',
    })
}

const deleteItem = async (id: string): Promise<AxiosResponse> => {
    return await axios.post(`/api/projects/${id}`, {
        _method: 'DELETE',
    })
}

const deleteProject = async (id: string): Promise<AxiosResponse> => {
    return await axios.post(`/api/projects/${id}`, {
        _method: 'DELETE',
    })
}

export default {
    getProject,
    getProjectItem,
    getList,
    getItem,
    createOrUpdate,
    createItem,
    updateItems,
    deleteItem,
    deleteProject,
}
