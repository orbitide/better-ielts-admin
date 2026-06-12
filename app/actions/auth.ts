import { httpClient } from '@/lib/api/http'
import type { AdminUser } from '@/lib/types/admin'

type ApiUser = {
    id: string
    name: string
    email: string
    role: string
    roles: string[]
    avatarUrl: string | null
    isEmailVerified: boolean
    mfaEnabled: boolean
    plan: string
    targetBand: number | null
    createdAt: string
}

type ApiLoginResponse = {
    success: boolean
    data?: {
        mfaRequired: boolean
        mfaChallengeToken?: string | null
        requiresEmailVerification?: boolean
        token: {
            accessToken: string
            refreshToken: string
            expiresIn: number
            user: ApiUser
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

function toAdminUser(user: ApiUser): AdminUser {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AdminUser['role'],
        roles: user.roles,
        avatarUrl: user.avatarUrl ?? '',
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        plan: user.plan,
        targetBand: user.targetBand,
        createdAt: user.createdAt,
    }
}

export async function loginAction(
    email: string,
    password: string
): Promise<
    | { ok: true; admin: AdminUser; accessToken: string; refreshToken: string; expiresIn: number }
    | { ok: false; error: string }
> {
    try {
        const {data} = await httpClient.post<ApiLoginResponse>('/api/admin/auth/login', {email, password})

        if (!data.success || !data.data?.token) {
            return {ok: false, error: data.message ?? 'Invalid email or password.'}
        }

        const {accessToken, refreshToken, expiresIn, user} = data.data.token

        return {
            ok: true,
            admin: toAdminUser(user),
            accessToken,
            refreshToken,
            expiresIn,
        }
    } catch (err) {
        return {ok: false, error: err instanceof Error ? err.message : 'Unable to connect to server.'}
    }
}

type ApiMeResponse = {
    success: boolean
    data?: ApiUser
}

export async function meAction(): Promise<{ ok: true; admin: AdminUser } | { ok: false }> {
    try {
        const {data} = await httpClient.get<ApiMeResponse>('/api/admin/auth/me')
        if (!data.success || !data.data) return {ok: false}
        return {ok: true, admin: toAdminUser(data.data)}
    } catch {
        return {ok: false}
    }
}

export async function logoutAction(): Promise<void> {
    try {
        await httpClient.post('/api/admin/auth/logout')
    } catch {
        // Ignore — session will expire naturally
    }
}

export async function refreshAction(): Promise<
    { ok: true; accessToken: string; refreshToken: string; expiresIn: number } | { ok: false }
> {
    try {
        const {data} = await httpClient.post<ApiTokenResponse>('/api/admin/auth/refresh')
        if (!data.success || !data.data) return {ok: false}
        return {ok: true, ...data.data}
    } catch {
        return {ok: false}
    }
}
