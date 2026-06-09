import { cache } from 'react'
import { fetchAdminStats } from '@/lib/api/admin'

const getStats = cache(async () => fetchAdminStats())

export const getDashboardStats = cache(async () => {
  const { stats } = await getStats()
  return stats
})

export const getUserGrowth = cache(async () => {
  const { userGrowth } = await getStats()
  return userGrowth
})

export const getSubscriptionBreakdown = cache(async () => {
  const { subscriptionBreakdown } = await getStats()
  return subscriptionBreakdown
})

export const getContentCounts = cache(async () => {
  const { contentCounts } = await getStats()
  return contentCounts
})
