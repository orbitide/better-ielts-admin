import { cache } from 'react'
import { fetchAdminUserById } from '@/lib/api/admin'

export const getUserById = cache(async (id: string) => {
  return fetchAdminUserById(id)
})
