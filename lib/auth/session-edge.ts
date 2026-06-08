import type { AdminUser } from '@/lib/types/admin'

export const ACCESS_COOKIE = 'admin_access'
export const REFRESH_COOKIE = 'admin_refresh'

type JwtPayload = {
  sub: string
  email: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
  exp: number
}

export type SessionInfo = {
  adminId: string
  role: AdminUser['role']
}

export function decodeSession(token: string): SessionInfo | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Decode base64url payload (Edge-safe, no crypto)
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    ) as JwtPayload

    if (payload.exp * 1000 < Date.now()) return null

    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    if (!['SuperAdmin', 'ContentManager', 'Moderator'].includes(role)) return null

    return {
      adminId: payload.sub,
      role: role as AdminUser['role'],
    }
  } catch {
    return null
  }
}
