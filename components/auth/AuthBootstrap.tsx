'use client'

import { useEffect } from 'react'
import { useAdminAuthStore } from '@/lib/store/auth-store'

export function AuthBootstrap() {
  useEffect(() => {
    useAdminAuthStore.getState().bootstrap()
  }, [])

  return null
}
