'use client'

import type { ReactNode } from 'react'
import type { Permission } from '@/lib/auth/permissions'
import { hasPermission } from '@/lib/auth/permissions'
import { useAdminAuthStore } from '@/lib/store/auth-store'

type RoleGateProps = {
  permission: Permission
  fallback?: ReactNode
  children: ReactNode
}

export function RoleGate({ permission, fallback = null, children }: RoleGateProps) {
  const admin = useAdminAuthStore((s) => s.admin)
  if (!admin || !hasPermission(admin.role, permission)) {
    return <>{fallback}</>
  }
  return <>{children}</>
}
