import { cache } from 'react'
import { fetchCallTopicById } from '@/lib/api/calls'

// Re-throws non-404 errors so they surface as server errors rather than not-found pages.
function onlyNotFound(err: unknown): undefined {
  if ((err as { status?: number }).status === 404) return undefined
  throw err
}

export const getFullCallTopic = cache(async (id: string) =>
  fetchCallTopicById(id).catch(onlyNotFound)
)
