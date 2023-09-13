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
        avatar: null,
        tenants: [],
    },
    setUser: (user: User) => {
        set({ user: user })

        // Change the current tenant if the existing one is no longer available
        const currentTenant = useTenantStore.getState().currentTenant
        if (currentTenant) {
            const matchedTenant = user.tenants.find(
                t => t.id === currentTenant.id,
            )
            if (!matchedTenant) {
                useTenantStore.getState().setCurrentTenant(user.tenants[0].id)
                return
            }
            return
        }

        // If the tenant is null, set it to the first tenant
        useTenantStore.getState().setCurrentTenant(user.tenants[0].id)
    },

    permissions: [],
    setPermissions: (permissions: string[]) =>
        set({ permissions: permissions }),

    userCan: (permission: string) => {
        return get().permissions.includes(permission)
    },
}))
