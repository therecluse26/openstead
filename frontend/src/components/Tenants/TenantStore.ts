import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthorizationStore } from '../Authorization/AuthorizationStore'

interface TenantState {
    currentTenantId: string | null
    setCurrentTenantId: (tenant: string) => void
}

export const useTenantStore = create<TenantState>()(
    persist(
        set => ({
            currentTenantId: null,
            setCurrentTenantId: (tenant: string) => {
                const user = useAuthorizationStore.getState().user
                const matchedTenant = user.tenants.find(t => t.id === tenant)
                if (matchedTenant) {
                    set({ currentTenantId: tenant })
                } else {
                    set({ currentTenantId: null })
                }
            },
        }),
        {
            name: 'tenant',
        },
    ),
)
