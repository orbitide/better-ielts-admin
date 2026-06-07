import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockSubscriptions } from '@/lib/mock/subscriptions'

export const getSubscriptions = cache(async () => {
  await delay(150)
  return mockSubscriptions
})
