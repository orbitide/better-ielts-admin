import { cache } from 'react'
import { fetchRecentTransactions } from '@/lib/api/admin'

export const getRecentTransactions = cache(async () => {
  return fetchRecentTransactions()
})
