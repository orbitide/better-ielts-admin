'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchWritingTaskById } from '@/lib/api/ielts'
import { WritingTaskDetailShell } from '@/components/ielts/WritingTaskDetailShell'
import type { FullWritingTask, SetContext } from '@/lib/types/ielts'

const WritingTaskDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [task, setTask] = useState<FullWritingTask | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  const setId = searchParams.get('setId')
  const setTitle = searchParams.get('setTitle')
  const testId = searchParams.get('testId')
  const testIndex = searchParams.get('testIndex')

  useEffect(() => {
    fetchWritingTaskById(id)
      .then((t) => {
        setTask(t)
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
        <p className="text-muted-foreground text-sm">Task not found.</p>
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

  return <WritingTaskDetailShell task={task!} setContext={setContext} />
}

export default WritingTaskDetailPage
