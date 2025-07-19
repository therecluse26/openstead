import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthorizationStore } from '../Authorization/AuthorizationStore'
import { Tenant } from '@/types/User'
import axios from '@/lib/axios'
import Router from 'next/router'

interface TenantState {
    currentTenant: Tenant | null
    setCurrentTenant: (tenant: string) => void
}

export const useTenantStore = create<TenantState>()(
    persist(
        set => ({
            currentTenant: null,
            setCurrentTenant: (tenant: string | null) => {
                if (!tenant) {
                    set({ currentTenant: null })
                    return
                }

                const oldTenant = useTenantStore.getState().currentTenant
                const user = useAuthorizationStore.getState().user
                const matchedTenant = user.tenants.find(t => t.id === tenant)
                if (matchedTenant) {
                    axios
                        .post('/api/user/tenant', {
                            tenant: matchedTenant.id,
                            user: user.id,
                        })
                        .then(() => {
                            set({ currentTenant: matchedTenant })
                            Router.push('/')
                        })
                        .catch(err => {
                            set({ currentTenant: oldTenant })
                        })
                } else {
                    set({ currentTenant: oldTenant })
                }
            },
        }),
        {
            name: 'tenant',
            getStorage: () => localStorage,
        },
    ),
)
