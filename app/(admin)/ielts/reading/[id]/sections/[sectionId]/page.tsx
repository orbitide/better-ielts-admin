'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchReadingTestById, fetchReadingSectionById, fetchReadingQuestions } from '@/lib/api/ielts'
import type { ReadingQuestionsPage } from '@/lib/api/ielts'
import { ReadingSectionShell } from '@/components/ielts/ReadingSectionShell'
import type { ReadingTestDetail, ReadingSection, SetContext } from '@/lib/types/ielts'

const QUESTIONS_PAGE_SIZE = 20

const ReadingSectionDetailPage = () => {
  const { id, sectionId } = useParams<{ id: string; sectionId: string }>()
  const searchParams = useSearchParams()
  const [test, setTest] = useState<ReadingTestDetail | null>(null)
  const [section, setSection] = useState<ReadingSection | null>(null)
  const [questionsPage, setQuestionsPage] = useState<ReadingQuestionsPage | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  const page = Number(searchParams.get('page') ?? '1') || 1
  const setId = searchParams.get('setId')
  const setTitle = searchParams.get('setTitle')
  const testId = searchParams.get('testId')
  const testIndex = searchParams.get('testIndex')

  useEffect(() => {
    Promise.all([
      fetchReadingTestById(id),
      fetchReadingSectionById(sectionId),
      fetchReadingQuestions(sectionId, page, QUESTIONS_PAGE_SIZE),
    ])
      .then(([t, s, qp]) => {
        setTest(t)
        setSection(s)
        setQuestionsPage(qp)
        setStatus('ready')
      })
      .catch(() => setStatus('not-found'))
  }, [id, sectionId, page])

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
        <p className="text-muted-foreground text-sm">Section not found.</p>
      </div>
    )
  }

  const setContext: SetContext | undefined =
    setId && setTitle && testId && testIndex
      ? {
          setId,
          setTitle,
          testId,
          testIndex: Number(testIndex),
        }
      : undefined

  return (
    <ReadingSectionShell
      test={test!}
      section={section!}
      initialQuestionsPage={questionsPage!}
      setContext={setContext}
    />
  )
}

export default ReadingSectionDetailPage
