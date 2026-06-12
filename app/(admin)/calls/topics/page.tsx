'use client'

import { useEffect, useState } from 'react'
import { fetchCallTopics } from '@/lib/api/calls'
import { CallTopicsContentClient } from '@/components/calls/CallTopicsContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'

export default function CallTopicsPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [topicCount, setTopicCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCallTopics(1, 100)
      .then((result) => {
        setRows(
          result.items.map((t) => ({
            id: t.id,
            title: t.label,
            meta: `${t.icon} · ${t.questions.length} question${t.questions.length !== 1 ? 's' : ''}`,
            status: t.status,
            createdAt: t.createdAt,
          }))
        )
        setTopicCount(result.items.length)
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-5 sm:p-6 text-sm text-muted-foreground">Loading…</p>
  }

  return <CallTopicsContentClient rows={rows} topicCount={topicCount} />
}
