import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockDashboardStats, mockUserGrowth, mockSubscriptionBreakdown, mockContentCounts } from '@/lib/mock/stats'

export const getDashboardStats = cache(async () => {
  await delay(150)
  return mockDashboardStats
})

export const getUserGrowth = cache(async () => {
  await delay(150)
  return mockUserGrowth
})

export const getSubscriptionBreakdown = cache(async () => {
  await delay(120)
  return mockSubscriptionBreakdown
})

export const getContentCounts = cache(async () => {
  await delay(100)
  return mockContentCounts
})
