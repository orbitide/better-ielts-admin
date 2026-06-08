'use server'

import { cookies } from 'next/headers'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
} from '@/lib/auth/session'
import type { AdminUser } from '@/lib/types/admin'

const API_URL = process.env.API_URL ?? 'http://localhost:5000'

type ApiTokenResponse = {
  success: boolean
  data?: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      role: string
      avatarUrl: string | null
    }
  }
  message?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ ok: true; admin: AdminUser } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const json: ApiTokenResponse = await res.json()

    if (!res.ok || !json.success || !json.data) {
      return { ok: false, error: json.message ?? 'Invalid email or password.' }
    }

    const { accessToken, refreshToken, user } = json.data
    const cookieStore = await cookies()

    cookieStore.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ACCESS_MAX_AGE,
      path: '/',
    })
    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: '/',
    })

    const admin: AdminUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as AdminUser['role'],
      avatarUrl: user.avatarUrl ?? '',
    }

    return { ok: true, admin }
  } catch {
    return { ok: false, error: 'Unable to connect to server. Please try again.' }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value

  if (refreshToken) {
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value
    try {
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      })
    } catch {
      // Ignore errors — clear cookies regardless
    }
  }

  cookieStore.delete(ACCESS_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}

export async function refreshAction(): Promise<boolean> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_URL}/api/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const json: ApiTokenResponse = await res.json()
    if (!res.ok || !json.success || !json.data) return false

    const { accessToken, refreshToken: newRefreshToken } = json.data
    cookieStore.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ACCESS_MAX_AGE,
      path: '/',
    })
    cookieStore.set(REFRESH_COOKIE, newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: '/',
    })
    return true
  } catch {
    return false
  }
}
