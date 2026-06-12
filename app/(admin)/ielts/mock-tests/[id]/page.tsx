'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetchFullIeltsSet } from '@/lib/api/ielts'
import { SetDetailShell } from '@/components/ielts/SetDetailShell'
import type { FullIeltsSet } from '@/lib/types/ielts'

const SetDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [set, setSet] = useState<FullIeltsSet | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  useEffect(() => {
    fetchFullIeltsSet(id)
      .then((s) => {
        setSet(s)
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
        <p className="text-muted-foreground text-sm">Set not found.</p>
      </div>
    )
  }

  return <SetDetailShell set={set!} />
}

export default SetDetailPage
