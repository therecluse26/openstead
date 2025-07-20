import { User } from './User'
import { InventoryBase } from './Inventory'

export interface Service {
    id: string
    name: string
    description?: string
    type: string
    created_at: string
    updated_at: string
}

export interface ServiceLog {
    id: string
    service: Service
    inventory_item: InventoryBase
    performer: User
    notes?: string
    performed_at: string
    next_service_date?: string
    cost?: number
    created_at: string
    updated_at: string
}

export interface ServiceLogFormData {
    service_id: string
    inventory_item_id: string
    notes?: string
    performed_at: string
    next_service_date?: string
    cost?: number
}
