'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchListeningTestById, fetchListeningSections } from '@/lib/api/ielts'
import type { ListeningSectionsPage } from '@/lib/api/ielts'
import { ListeningTestDetailShell } from '@/components/ielts/ListeningTestDetailShell'
import type { ListeningTestDetail, SetContext } from '@/lib/types/ielts'

const SECTIONS_PAGE_SIZE = 10

const ListeningTestDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [test, setTest] = useState<ListeningTestDetail | null>(null)
  const [sectionsPage, setSectionsPage] = useState<ListeningSectionsPage | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  const page = Number(searchParams.get('page') ?? '1') || 1
  const setId = searchParams.get('setId')
  const setTitle = searchParams.get('setTitle')
  const testId = searchParams.get('testId')
  const testIndex = searchParams.get('testIndex')

  useEffect(() => {
    Promise.all([
      fetchListeningTestById(id),
      fetchListeningSections(id, page, SECTIONS_PAGE_SIZE),
    ])
      .then(([t, sp]) => {
        setTest(t)
        setSectionsPage(sp)
        setStatus('ready')
      })
      .catch(() => setStatus('not-found'))
  }, [id, page])

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

  const setContext: SetContext | undefined =
    setId && setTitle && testId && testIndex
      ? {
          setId,
          setTitle,
          testId,
          testIndex: Number(testIndex),
        }
      : undefined

  return <ListeningTestDetailShell test={test!} initialSectionsPage={sectionsPage!} setContext={setContext} />
}

export default ListeningTestDetailPage
