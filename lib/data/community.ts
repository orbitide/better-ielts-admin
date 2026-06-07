import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockCommunityThreads } from '@/lib/mock/community-threads'

export const getCommunityThreads = cache(async () => {
  await delay(150)
  return mockCommunityThreads
})
