'use server'

import { cookies } from 'next/headers'
import axios from 'axios'
import serverApi from '@/lib/api/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
} from '@/lib/auth/session'
import type { AdminUser } from '@/lib/types/admin'

type ApiTokenResponse = {
  success: boolean
  data?: {
    mfaRequired: boolean
    token: {
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
  }
  message?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ ok: true; admin: AdminUser } | { ok: false; error: string }> {
  try {
    const { data: json } = await serverApi.post<ApiTokenResponse>('/api/admin/auth/login', {
      email,
      password,
    })

    if (!json.success || !json.data?.token) {
      return { ok: false, error: json.message ?? 'Invalid email or password.' }
    }

    const { accessToken, refreshToken, user } = json.data.token
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
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const json = err.response.data as ApiTokenResponse
      return { ok: false, error: json.message ?? 'Invalid email or password.' }
    }
    return { ok: false, error: 'Unable to connect to server. Please try again.' }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value

  if (refreshToken) {
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value
    try {
      await serverApi.post(
        '/api/admin/auth/logout',
        { refreshToken },
        { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
      )
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
    const { data: json } = await serverApi.post<ApiTokenResponse>('/api/admin/auth/refresh', {
      refreshToken,
    })

    if (!json.success || !json.data?.token) return false

    const { accessToken, refreshToken: newRefreshToken } = json.data.token
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
