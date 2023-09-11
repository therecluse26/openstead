export interface Tenant {
    id: string
    name: string
}

export interface User {
    id: string
    name: string
    email: string
    tenants: Array<Tenant>
}
