export interface InventoryBase {
    id: string
    name: string
    description?: string
    type: string
    subtype?: string
    variety?: Variety
    location?: Location
    quantity?: number
    condition?: string
    notes?: Note[]
    media?: Media[]
    created_at: string
    updated_at: string
}

export interface Equipment extends InventoryBase {
    manufacturer?: string
    model?: string
    serial_number?: string
    purchase_date?: string
    purchase_price?: number
    power_source?: string
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'
}

export interface Livestock extends InventoryBase {
    sex: 'male' | 'female' | 'unknown'
    breed?: string
    date_of_birth?: string
    parent_male?: Livestock
    parent_female?: Livestock
    children?: Livestock[]
    weight?: number
    alive: boolean
    date_of_death?: string
}

export interface Seed extends InventoryBase {
    seed_count?: number
    expiration_date?: string
    harvest_date?: string
    plant_type: string
    light_requirement?: string
    hardiness_zone?: string
    lifecycle?: string
    days_to_maturity?: number
}

export interface PantryItem extends InventoryBase {
    expiration_date?: string
    storage_type: string
    unit: string
    purchase_date?: string
    nutritional_info?: string
}

export interface Variety {
    id: string
    name: string
    type: string
    description?: string
}

export interface Location {
    id: string
    name: string
    description?: string
}

export interface Note {
    id: string
    title?: string
    content: string
    author: {
        id: string
        name: string
    }
    created_at: string
    updated_at: string
}

export interface Media {
    id: string
    name: string
    file_name: string
    mime_type: string
    size: number
    url: string
    thumbnail_url?: string
}

export interface InventoryListParams {
    page?: number
    per_page?: number
    search?: string
    type?: string
    subtype?: string
    location?: string
    sort_by?: string
    sort_direction?: 'asc' | 'desc'
    filters?: Record<string, any>
}

export interface InventoryListResponse {
    data: InventoryBase[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
}

export interface InventoryType {
    value: string
    label: string
    subtypes?: InventorySubtype[]
}

export interface InventorySubtype {
    value: string
    label: string
}
