import { cache } from 'react'
import {
  fetchReadingTests, fetchReadingTestById,
  fetchListeningTests, fetchListeningTestById,
  fetchWritingTasks, fetchWritingTaskById,
  fetchSpeakingSessions, fetchSpeakingSessionById,
  fetchVocabTopics, fetchVocabTopicById,
  fetchIeltsSets, fetchIeltsSetById,
} from '@/lib/api/ielts'

export const getReadingTests = cache(async () =>
  fetchReadingTests(1, 100).then(r => r.items).catch(() => [])
)

export const getListeningTests = cache(async () =>
  fetchListeningTests(1, 100).then(r => r.items).catch(() => [])
)

export const getWritingTasks = cache(async () =>
  fetchWritingTasks(1, 100).then(r => r.items).catch(() => [])
)

export const getSpeakingSessions = cache(async () =>
  fetchSpeakingSessions(1, 100).then(r => r.items).catch(() => [])
)

export const getVocabTopics = cache(async () =>
  fetchVocabTopics(1, 100).then(r => r.items).catch(() => [])
)

export const getIeltsSets = cache(async () =>
  fetchIeltsSets(1, 100).then(r => r.items).catch(() => [])
)

export const getFullReadingTest = cache(async (id: string) =>
  fetchReadingTestById(id).catch(() => undefined)
)

export const getFullListeningTest = cache(async (id: string) =>
  fetchListeningTestById(id).catch(() => undefined)
)

export const getFullWritingTask = cache(async (id: string) =>
  fetchWritingTaskById(id).catch(() => undefined)
)

export const getFullSpeakingSession = cache(async (id: string) =>
  fetchSpeakingSessionById(id).catch(() => undefined)
)

export const getFullVocabTopic = cache(async (id: string) =>
  fetchVocabTopicById(id).catch(() => undefined)
)

export const getFullIeltsSet = cache(async (setId: string) =>
  fetchIeltsSetById(setId).catch(() => undefined)
)

export const getFullIeltsTestInSet = cache(async (setId: string, testId: string) => {
  const set = await fetchIeltsSetById(setId).catch(() => undefined)
  if (!set) return undefined
  const test = set.tests.find(t => t.id === testId)
  if (!test) return undefined
  return { set, test }
})
