'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuthStore } from '@/lib/store/auth-store'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const CHECK_INTERVAL_MS = 60 * 1000 // check every 60 seconds

export function SessionWatcher() {
  const logout = useAdminAuthStore((s) => s.logout)
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    if (!isAuthenticated) return

    const resetActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const events = ['mousemove', 'keydown', 'click', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, resetActivity, { passive: true }))

    const interval = setInterval(async () => {
      if (Date.now() - lastActivityRef.current > TIMEOUT_MS) {
        await logout()
        router.replace('/login?reason=timeout')
      }
    }, CHECK_INTERVAL_MS)

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity))
      clearInterval(interval)
    }
  }, [isAuthenticated, logout, router])

  return null
}
