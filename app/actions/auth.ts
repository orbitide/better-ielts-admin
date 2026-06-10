import http from '@/lib/api/http'
import type { AdminUser } from '@/lib/types/admin'

type ApiLoginResponse = {
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
    const { data } = await http.post<ApiLoginResponse>('/api/admin/auth/login', { email, password })

    if (!data.success || !data.data?.token) {
      return { ok: false, error: data.message ?? 'Invalid email or password.' }
    }

    const { user } = data.data.token
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

export async function logoutAction(): Promise<void> {
  try {
    await http.post('/api/admin/auth/logout')
  } catch {
    // Ignore — session will expire naturally
  }
}

export async function refreshAction(): Promise<boolean> {
  try {
    const { data } = await http.post<{ success: boolean }>('/api/admin/auth/refresh')
    return data.success ?? false
  } catch {
    return false
  }
}
