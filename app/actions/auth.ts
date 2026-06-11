'use server'

import { cookies } from 'next/headers'
import httpClient from '@/lib/api/http'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth/session'
import type { AdminUser } from '@/lib/types/admin'

type ApiLoginResponse = {
  success: boolean
  data?: {
    mfaRequired: boolean
    token: {
      accessToken: string
      refreshToken: string
      expiresIn: number
      user: {
        id: string
        name: string
        email: string
        role: string
        avatarUrl: string | null
      }
    }
  }
  message?: string
}

type ApiTokenResponse = {
  success: boolean
  data?: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  message?: string
}

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30 // 30 days, matches backend refresh token lifetime

async function setAuthCookies(accessToken: string, refreshToken: string, expiresIn: number) {
  const cookieStore = await cookies()
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }
  cookieStore.set(ACCESS_COOKIE, accessToken, { ...options, maxAge: expiresIn })
  cookieStore.set(REFRESH_COOKIE, refreshToken, { ...options, maxAge: REFRESH_MAX_AGE })
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ ok: true; admin: AdminUser } | { ok: false; error: string }> {
  try {
    const { data } = await httpClient.post<ApiLoginResponse>('/api/admin/auth/login', { email, password })

    if (!data.success || !data.data?.token) {
      return { ok: false, error: data.message ?? 'Invalid email or password.' }
    }

    const { accessToken, refreshToken, expiresIn, user } = data.data.token
    await setAuthCookies(accessToken, refreshToken, expiresIn)

    return {
      ok: true,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AdminUser['role'],
        avatarUrl: user.avatarUrl ?? '',
      },
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unable to connect to server.' }
  }
}

type ApiMeResponse = {
  success: boolean
  data?: {
    id: string
    name: string
    email: string
    role: string
    avatarUrl: string | null
  }
}

export async function meAction(): Promise<{ ok: true; admin: AdminUser } | { ok: false }> {
  try {
    const { data } = await httpClient.get<ApiMeResponse>('/api/admin/auth/me')
    if (!data.success || !data.data) return { ok: false }
    const user = data.data
    return {
      ok: true,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AdminUser['role'],
        avatarUrl: user.avatarUrl ?? '',
      },
    }
  } catch {
    return { ok: false }
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await httpClient.post('/api/admin/auth/logout')
  } catch {
    // Ignore — session will expire naturally
  }
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}

export async function refreshAction(): Promise<boolean> {
  try {
    const { data } = await httpClient.post<ApiTokenResponse>('/api/admin/auth/refresh')
    if (!data.success || !data.data) return false
    await setAuthCookies(data.data.accessToken, data.data.refreshToken, data.data.expiresIn)
    return true
  } catch {
    return false
  }
}
