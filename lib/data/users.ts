import { cache } from 'react'
import { fetchAdminUsers, fetchAdminUserById } from '@/lib/api/admin'

export const getUsers = cache(async (page = 1, pageSize = 50) => {
  return fetchAdminUsers(page, pageSize)
})

export const getUserById = cache(async (id: string) => {
  return fetchAdminUserById(id)
})
