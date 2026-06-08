'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/lib/types/admin'
import { loginAction, logoutAction } from '@/app/actions/auth'

type AdminAuthState = {
  admin: AdminUser | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
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
          return true
        }
        return false
      },
      logout: async () => {
        await logoutAction()
        set({ admin: null, isAuthenticated: false })
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
