import type { AdminUser } from '@/lib/types/admin'

export const SESSION_COOKIE_NAME = 'admin_session'
export const SESSION_MAX_AGE = 30 * 60 // 30 minutes in seconds

type SessionPayload = {
  adminId: string
  role: AdminUser['role']
  exp: number
}

export function encodeSession(payload: Omit<SessionPayload, 'exp'>): string {
  const data: SessionPayload = { ...payload, exp: Date.now() + SESSION_MAX_AGE * 1000 }
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export function decodeSession(token: string): SessionPayload | null {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString('utf8')) as SessionPayload
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}
