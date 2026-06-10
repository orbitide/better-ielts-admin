import { cache } from 'react'
import { fetchCallTopics, fetchCallTopicById } from '@/lib/api/calls'

// Re-throws non-404 errors so they surface as server errors rather than not-found pages.
function onlyNotFound(err: unknown): undefined {
  if ((err as { status?: number }).status === 404) return undefined
  throw err
}

export const getCallTopics = cache(async () =>
  fetchCallTopics(1, 100).then(r => r.items).catch(onlyNotFound) ?? []
)

export const getFullCallTopic = cache(async (id: string) =>
  fetchCallTopicById(id).catch(onlyNotFound)
)
