import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingState {
    theme: string | null
    setTheme: (theme: string) => void

    sidebarMenuActive: boolean
    setSidebarMenuActive: (active: boolean) => void
}

export const useSettingStore = create<SettingState>()(
    persist(
        set => ({
            theme: 'arya-blue',
            setTheme: (theme: string) => set({ theme: theme }),

            sidebarMenuActive: true,
            setSidebarMenuActive: (active: boolean) =>
                set({ sidebarMenuActive: active }),
        }),
        {
            name: 'settings',
        },
    ),
)
