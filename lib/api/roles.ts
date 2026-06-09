import axios from 'axios'
import type { BackendRole, BackendPermission } from '@/lib/types/roles'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_URL}/api/admin/auth`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export async function createRole(name: string, description: string): Promise<BackendRole> {
  const { data } = await api.post<{ data: BackendRole }>('/roles', { name, description })
  return data.data
}

export async function updateRole(id: string, description: string, isActive: boolean): Promise<BackendRole> {
  const { data } = await api.put<{ data: BackendRole }>(`/roles/${id}`, { description, isActive })
  return data.data
}

export async function getRolePermissions(roleId: string): Promise<BackendPermission[]> {
  const { data } = await api.get<{ data: BackendPermission[] }>(`/roles/${roleId}/permissions`)
  return data.data ?? []
}

export async function assignPermission(roleId: string, permissionId: string): Promise<void> {
  await api.post(`/roles/${roleId}/permissions/${permissionId}`)
}

export async function removePermission(roleId: string, permissionId: string): Promise<void> {
  await api.delete(`/roles/${roleId}/permissions/${permissionId}`)
}
