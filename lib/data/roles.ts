import { cookies } from 'next/headers'
import serverApi from '@/lib/api/server'
import type { BackendRole, BackendPermission } from '@/lib/types/roles'

async function authHeader() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_access')?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getRoles(): Promise<BackendRole[]> {
  try {
    const { data: json } = await serverApi.get('/api/admin/auth/roles', {
      headers: await authHeader(),
    })
    return (json.data as BackendRole[]) ?? []
  } catch {
    return []
  }
}

export async function getAllPermissions(): Promise<BackendPermission[]> {
  try {
    const { data: json } = await serverApi.get('/api/admin/auth/permissions', {
      headers: await authHeader(),
    })
    return (json.data as BackendPermission[]) ?? []
  } catch {
    return []
  }
}
