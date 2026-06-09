import { cache } from 'react'
import { fetchAdminSubscriptions } from '@/lib/api/admin'

export const getSubscriptions = cache(async (page = 1, pageSize = 50) => {
  const result = await fetchAdminSubscriptions(page, pageSize)
  return result.items
})
