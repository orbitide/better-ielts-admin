'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchListeningTestById } from '@/lib/api/ielts'
import { ListeningTestDetailShell } from '@/components/ielts/ListeningTestDetailShell'
import type { FullListeningTest, SetContext } from '@/lib/types/ielts'

const ListeningTestDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [test, setTest] = useState<FullListeningTest | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  const setId = searchParams.get('setId')
  const setTitle = searchParams.get('setTitle')
  const testId = searchParams.get('testId')
  const testIndex = searchParams.get('testIndex')

  useEffect(() => {
    fetchListeningTestById(id)
      .then((t) => {
        setTest(t)
        setStatus('ready')
      })
      .catch(() => setStatus('not-found'))
  }, [id])

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

  return <ListeningTestDetailShell test={test!} setContext={setContext} />
}

export default ListeningTestDetailPage
