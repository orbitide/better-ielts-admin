// Edge-runtime-safe session decoding — uses atob() instead of Buffer

export const SESSION_COOKIE_NAME = 'admin_session'
export const SESSION_MAX_AGE = 30 * 60 // 30 minutes in seconds

type SessionPayload = {
  adminId: string
  role: 'super_admin' | 'content_manager' | 'moderator'
  exp: number
}

export function decodeSession(token: string): SessionPayload | null {
  try {
    const data = JSON.parse(atob(token)) as SessionPayload
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}
