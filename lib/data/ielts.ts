import { cache } from 'react'
import {
  fetchReadingTests, fetchReadingTestById, fetchReadingSections, fetchReadingSectionById, fetchReadingQuestions,
  fetchListeningTests, fetchListeningTestById, fetchListeningSections, fetchListeningSectionById, fetchListeningQuestions,
  fetchWritingTasks, fetchWritingTaskById,
  fetchSpeakingSessions, fetchSpeakingSessionById, fetchSpeakingParts,
  fetchVocabTopics, fetchVocabTopicById,
  fetchIeltsSets, fetchFullIeltsSet,
} from '@/lib/api/ielts'

// Re-throws non-404 errors so they surface as server errors rather than not-found pages.
function onlyNotFound(err: unknown): undefined {
  if ((err as { status?: number }).status === 404) return undefined
  throw err
}

export const getReadingTests = cache(async () =>
  (await fetchReadingTests(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getListeningTests = cache(async () =>
  (await fetchListeningTests(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getWritingTasks = cache(async () =>
  (await fetchWritingTasks(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getSpeakingSessions = cache(async () =>
  (await fetchSpeakingSessions(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getVocabTopics = cache(async () =>
  (await fetchVocabTopics(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getIeltsSets = cache(async () =>
  (await fetchIeltsSets(1, 100).then(r => r.items).catch(onlyNotFound)) ?? []
)

export const getReadingTestDetail = cache(async (id: string) =>
  fetchReadingTestById(id).catch(onlyNotFound)
)

export const getReadingSections = cache(async (testId: string, page = 1, pageSize = 10) =>
  fetchReadingSections(testId, page, pageSize).catch(onlyNotFound)
)

export const getReadingSectionDetail = cache(async (sectionId: string) =>
  fetchReadingSectionById(sectionId).catch(onlyNotFound)
)

export const getReadingQuestions = cache(async (sectionId: string, page = 1, pageSize = 20) =>
  fetchReadingQuestions(sectionId, page, pageSize).catch(onlyNotFound)
)

export const getListeningTestDetail = cache(async (id: string) =>
  fetchListeningTestById(id).catch(onlyNotFound)
)

export const getListeningSections = cache(async (testId: string, page = 1, pageSize = 10) =>
  fetchListeningSections(testId, page, pageSize).catch(onlyNotFound)
)

export const getListeningSectionDetail = cache(async (sectionId: string) =>
  fetchListeningSectionById(sectionId).catch(onlyNotFound)
)

export const getListeningQuestions = cache(async (sectionId: string, page = 1, pageSize = 20) =>
  fetchListeningQuestions(sectionId, page, pageSize).catch(onlyNotFound)
)

export const getFullWritingTask = cache(async (id: string) =>
  fetchWritingTaskById(id).catch(onlyNotFound)
)

export const getSpeakingSessionDetail = cache(async (id: string) =>
  fetchSpeakingSessionById(id).catch(onlyNotFound)
)

export const getSpeakingParts = cache(async (sessionId: string) =>
  fetchSpeakingParts(sessionId).catch(onlyNotFound)
)

export const getFullVocabTopic = cache(async (id: string) =>
  fetchVocabTopicById(id).catch(onlyNotFound)
)

export const getFullIeltsSet = cache(async (setId: string) =>
  fetchFullIeltsSet(setId).catch(onlyNotFound)
)

export const getFullIeltsTestInSet = cache(async (setId: string, testId: string) => {
  const set = await getFullIeltsSet(setId)
  if (!set) return undefined
  const test = set.tests.find(t => t.id === testId)
  if (!test) return undefined
  return { set, test }
})
