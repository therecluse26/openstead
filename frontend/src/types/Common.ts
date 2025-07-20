export interface ApiResponse<T = any> {
    data: T
    message?: string
    errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
}

export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
}

export interface FilterOptions {
    [key: string]: any
}

export interface SortOptions {
    field: string
    order: 'asc' | 'desc'
}

export interface DataTableColumn {
    field: string
    header: string
    sortable?: boolean
    filterable?: boolean
    body?: (rowData: any) => React.ReactNode
    filter?: (value: any, filter: any) => boolean
}

export interface FormField {
    name: string
    label: string
    type:
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'textarea'
        | 'select'
        | 'multiselect'
        | 'calendar'
        | 'editor'
    required?: boolean
    options?: SelectOption[]
    placeholder?: string
    validation?: any
}

export interface Toast {
    severity: 'success' | 'info' | 'warn' | 'error'
    summary: string
    detail?: string
    life?: number
}

export interface DropdownItem {
    label: string
    value: any
    disabled?: boolean
    icon?: string
}
