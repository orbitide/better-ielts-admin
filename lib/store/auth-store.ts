'use client'

import { create } from 'zustand'
import type { AdminUser } from '@/lib/types/admin'
import { loginAction, logoutAction, refreshAction, meAction } from '@/app/actions/auth'

type AdminAuthState = {
    admin: AdminUser | null
    isAuthenticated: boolean
    _hasHydrated: boolean
    bootstrap: () => Promise<void>
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
    logout: () => Promise<void>
    refresh: () => Promise<boolean>
    setHasHydrated: (has: boolean) => void
}

export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
    admin: null,
    isAuthenticated: false,
    _hasHydrated: false,
    bootstrap: async () => {
        const result = await meAction()
        if (result.ok) {
            set({admin: result.admin, isAuthenticated: true, _hasHydrated: true})
        } else {
            set({admin: null, isAuthenticated: false, _hasHydrated: true})
        }
    },
    login: async (email, password) => {
        const result = await loginAction(email, password)
        if (result.ok) {
            set({admin: result.admin, isAuthenticated: true})
            return {ok: true}
        }
        return {ok: false, error: result.error}
    },
    logout: async () => {
        await logoutAction()
        set({admin: null, isAuthenticated: false})
    },
    refresh: async () => {
        const result = await refreshAction()
        if (!result.ok) {
            set({admin: null, isAuthenticated: false})
            return false
        }
        return true
    },
    setHasHydrated: (has) => set({_hasHydrated: has}),
}))
