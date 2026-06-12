import type { ContentRow } from '@/components/ielts/ContentTable'
import type { ReadingTest, ListeningTest, WritingTask, SpeakingSession } from '@/lib/types/ielts'

export function toReadingRows(tests: ReadingTest[]): ContentRow[] {
  return tests.map((t) => ({
    id: t.id,
    title: t.title,
    setName: t.setName,
    testName: t.testName,
    type: t.type,
    stats: { passages: t.passageCount, questions: t.questionCount },
    status: t.status,
    createdAt: t.createdAt,
  }))
}

export function toListeningRows(tests: ListeningTest[]): ContentRow[] {
  return tests.map((t) => ({
    id: t.id,
    title: t.title,
    setName: t.setName,
    testName: t.testName,
    stats: { sections: t.sectionCount, questions: t.questionCount, audio: t.audioUrl ? 'Uploaded' : 'Missing' },
    status: t.status,
    createdAt: t.createdAt,
  }))
}

export function toWritingRows(tasks: WritingTask[]): ContentRow[] {
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    setName: t.setName,
    testName: t.testName,
    type: t.type,
    stats: { minWords: `${t.wordMinimum}+`, time: `${t.timeMinutes} min` },
    status: t.status,
    createdAt: t.createdAt,
  }))
}

export function toSpeakingRows(sessions: SpeakingSession[]): ContentRow[] {
  return sessions.map((s) => ({
    id: s.id,
    title: s.title,
    setName: s.setName,
    testName: s.testName,
    stats: { topic: s.topic, parts: s.partCount },
    status: s.status,
    createdAt: s.createdAt,
  }))
}
