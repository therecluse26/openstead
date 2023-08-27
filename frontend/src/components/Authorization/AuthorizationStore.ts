import { create } from 'zustand'
import { User } from '@/types/User'

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
    },
    setUser: (user: User) => set({ user: user }),
    permissions: [],
    setPermissions: (permissions: string[]) =>
        set({ permissions: permissions }),
    userCan: (permission: string) => {
        return get().permissions.includes(permission)
    },
}))
