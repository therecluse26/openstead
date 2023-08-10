import { User } from './User'

export interface Project {
    id: string
    name: string
    description: string
    created_at: string
    updated_at: string
}

export interface ProjectItem {
    id: string
    title: string
    description: string
    status: string
    assignee: User
    creator: User
    due_date: string
    created_at: string
    updated_at: string
}

export interface ProjectUser {
    id: string
    user_id: string
    role: string
}
