'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/lib/types/admin'
import { loginAction, logoutAction, refreshAction } from '@/app/actions/auth'

type AdminAuthState = {
  admin: AdminUser | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
  setHasHydrated: (has: boolean) => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login: async (email, password) => {
        const result = await loginAction(email, password)
        if (result.ok) {
          set({ admin: result.admin, isAuthenticated: true })
          return { ok: true }
        }
        return { ok: false, error: result.error }
      },
      logout: async () => {
        await logoutAction()
        set({ admin: null, isAuthenticated: false })
      },
      refresh: async () => {
        const ok = await refreshAction()
        if (!ok) {
          set({ admin: null, isAuthenticated: false })
        }
        return ok
      },
      setHasHydrated: (has) => set({ _hasHydrated: has }),
    }),
    {
      name: 'admin-auth-session',
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
