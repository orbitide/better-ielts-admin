'use server'

import { cookies } from 'next/headers'
import { MOCK_ACCOUNTS } from '@/lib/auth/mock-accounts'
import { encodeSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session'
import type { AdminUser } from '@/lib/types/admin'

export async function loginAction(
  email: string,
  password: string
): Promise<{ ok: true; admin: AdminUser } | { ok: false; error: string }> {
  const account = MOCK_ACCOUNTS.find(
    (a) => a.email === email && a.password === password
  )
  if (!account) {
    return { ok: false, error: 'Invalid email or password.' }
  }
  const token = encodeSession({ adminId: account.adminUser.id, role: account.adminUser.role })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return { ok: true, admin: account.adminUser }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
