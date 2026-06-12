'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  fetchFullIeltsSet,
  fetchReadingTests,
  fetchListeningTests,
  fetchWritingTasks,
  fetchSpeakingSessions,
} from '@/lib/api/ielts'
import { TestDetailShell } from '@/components/ielts/TestDetailShell'
import type { FullIeltsSet, FullIeltsTest } from '@/lib/types/ielts'

type SkillOption = { id: string; title: string }

type Result = {
  setId: string
  setTitle: string
  test: FullIeltsTest
  availableSkills: {
    reading: SkillOption[]
    listening: SkillOption[]
    writing: SkillOption[]
    speaking: SkillOption[]
  }
}

const TestDetailPage = () => {
  const { id: setId, testId } = useParams<{ id: string; testId: string }>()
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  useEffect(() => {
    Promise.all([
      fetchFullIeltsSet(setId),
      fetchReadingTests(1, 100).then((r) => r.items).catch(() => []),
      fetchListeningTests(1, 100).then((r) => r.items).catch(() => []),
      fetchWritingTasks(1, 100).then((r) => r.items).catch(() => []),
      fetchSpeakingSessions(1, 100).then((r) => r.items).catch(() => []),
    ])
      .then(([set, reading, listening, writing, speaking]) => {
        const test = set.tests.find((t) => t.id === testId)
        if (!test) {
          setStatus('not-found')
          return
        }
        setResult({
          setId: set.id,
          setTitle: set.title,
          test,
          availableSkills: {
            reading: reading.map((t) => ({ id: t.id, title: t.title })),
            listening: listening.map((t) => ({ id: t.id, title: t.title })),
            writing: writing.map((t) => ({ id: t.id, title: t.title })),
            speaking: speaking.map((t) => ({ id: t.id, title: t.title })),
          },
        })
        setStatus('ready')
      })
      .catch(() => setStatus('not-found'))
  }, [setId, testId])

  if (status === 'loading') {
    return (
      <div className="space-y-5">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-7 w-48 rounded bg-muted animate-pulse" />
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-9 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm">Test not found.</p>
      </div>
    )
  }

  return (
    <TestDetailShell
      setId={result!.setId}
      setTitle={result!.setTitle}
      test={result!.test}
      availableSkills={result!.availableSkills}
    />
  )
}

export default TestDetailPage
