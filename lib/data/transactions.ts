import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockTransactions } from '@/lib/mock/transactions'

export const getRecentTransactions = cache(async () => {
  await delay(150)
  return [...mockTransactions]
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt))
    .slice(0, 5)
})
