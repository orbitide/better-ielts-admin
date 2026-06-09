import serverApi from '@/lib/api/server'
import type { BackendRole, BackendPermission } from '@/lib/types/roles'

export async function getRoles(): Promise<BackendRole[]> {
  try {
    const { data: json } = await serverApi.get('/api/admin/auth/roles')
    return (json.data as BackendRole[]) ?? []
  } catch {
    return []
  }
}

export async function getAllPermissions(): Promise<BackendPermission[]> {
  try {
    const { data: json } = await serverApi.get('/api/admin/auth/permissions')
    return (json.data as BackendPermission[]) ?? []
  } catch {
    return []
  }
}
