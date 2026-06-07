import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockReadingTests } from '@/lib/mock/reading-tests'
import { mockListeningTests } from '@/lib/mock/listening-tests'
import { mockWritingTasks } from '@/lib/mock/writing-tasks'
import { mockSpeakingSessions } from '@/lib/mock/speaking-sessions'
import { mockMockTests } from '@/lib/mock/mock-tests'
import { mockVocabTopics } from '@/lib/mock/vocabulary'

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
