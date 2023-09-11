import { create } from 'zustand'
import { User } from '@/types/User'
import { useTenantStore } from '../Tenants/TenantStore'

interface AuthorizationState {
    user: User | null
    permissions: string[]
    setUser: (user: User) => void
    setPermissions: (permissions: string[]) => void
    userCan: (permission: string) => boolean
}

export const useAuthorizationStore = create<AuthorizationState>((set, get) => ({
    user: {
        id: null,
        name: null,
        email: null,
        tenants: [],
    },
    setUser: (user: User) => {
        set({ user: user })
        // Set the current tenant to the first tenant in the list
        const tenant = user.tenants[0]
        if (tenant) {
            useTenantStore.getState().setCurrentTenantId(tenant.id)
        }
    },

    permissions: [],
    setPermissions: (permissions: string[]) =>
        set({ permissions: permissions }),

    userCan: (permission: string) => {
        return get().permissions.includes(permission)
    },
}))
