'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuthStore } from '@/lib/store/auth-store'

export function AuthGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAdminAuthStore((s) => s._hasHydrated)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [hasHydrated, isAuthenticated, router, pathname])

  if (!hasHydrated || !isAuthenticated) return null
  return <>{children}</>
}
