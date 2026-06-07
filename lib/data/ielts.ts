import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockReadingTests } from '@/lib/mock/reading-tests'
import { mockListeningTests } from '@/lib/mock/listening-tests'
import { mockWritingTasks } from '@/lib/mock/writing-tasks'
import { mockSpeakingSessions } from '@/lib/mock/speaking-sessions'
import { mockMockTests } from '@/lib/mock/mock-tests'
import { mockVocabTopics } from '@/lib/mock/vocabulary'
import { mockFullReadingTests } from '@/lib/mock/reading-tests-full'
import { mockFullListeningTests } from '@/lib/mock/listening-tests-full'
import { mockFullWritingTasks } from '@/lib/mock/writing-tasks-full'
import { mockFullSpeakingSessions } from '@/lib/mock/speaking-sessions-full'
import { mockFullMockTests } from '@/lib/mock/mock-tests-full'

// ─── Flat list getters (used by list pages) ───────────────────────────────────

export const getReadingTests = cache(async () => {
  await delay(150)
  return mockReadingTests
})

export const getListeningTests = cache(async () => {
  await delay(150)
  return mockListeningTests
})

export const getWritingTasks = cache(async () => {
  await delay(150)
  return mockWritingTasks
})

export const getSpeakingSessions = cache(async () => {
  await delay(150)
  return mockSpeakingSessions
})

export const getMockTests = cache(async () => {
  await delay(150)
  return mockMockTests
})

export const getVocabTopics = cache(async () => {
  await delay(150)
  return mockVocabTopics
})

// ─── Full nested getters (used by detail pages) ───────────────────────────────

export const getFullReadingTest = cache(async (id: string) => {
  await delay(150)
  return mockFullReadingTests.find((t) => t.id === id)
})

export const getFullListeningTest = cache(async (id: string) => {
  await delay(150)
  return mockFullListeningTests.find((t) => t.id === id)
})

export const getFullWritingTask = cache(async (id: string) => {
  await delay(150)
  return mockFullWritingTasks.find((t) => t.id === id)
})

export const getFullSpeakingSession = cache(async (id: string) => {
  await delay(150)
  return mockFullSpeakingSessions.find((s) => s.id === id)
})

export const getFullMockTest = cache(async (id: string) => {
  await delay(150)
  return mockFullMockTests.find((t) => t.id === id)
})
