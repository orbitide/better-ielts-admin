import http from '@/lib/api/http'
import type { BackendRole, BackendPermission } from '@/lib/types/roles'

export async function createRole(name: string, description: string): Promise<BackendRole> {
  const { data } = await http.post<{ data: BackendRole }>('/api/admin/auth/roles', { name, description })
  return data.data
}

export async function updateRole(id: string, description: string, isActive: boolean): Promise<BackendRole> {
  const { data } = await http.put<{ data: BackendRole }>(`/api/admin/auth/roles/${id}`, { description, isActive })
  return data.data
}

export async function getRolePermissions(roleId: string): Promise<BackendPermission[]> {
  const { data } = await http.get<{ data: BackendPermission[] }>(`/api/admin/auth/roles/${roleId}/permissions`)
  return data.data ?? []
}

export async function assignPermission(roleId: string, permissionId: string): Promise<void> {
  await http.post(`/api/admin/auth/roles/${roleId}/permissions/${permissionId}`)
}

export async function removePermission(roleId: string, permissionId: string): Promise<void> {
  await http.delete(`/api/admin/auth/roles/${roleId}/permissions/${permissionId}`)
}
