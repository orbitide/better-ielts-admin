'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/lib/types/admin'
import { mockAdminUser } from '@/lib/mock/admin'
import { ADMIN_CREDENTIALS } from '@/lib/auth/dummy-credentials'

type AdminAuthState = {
  admin: AdminUser | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  setHasHydrated: (has: boolean) => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ admin: mockAdminUser, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ admin: null, isAuthenticated: false }),
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
