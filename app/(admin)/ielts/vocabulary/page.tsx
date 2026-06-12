'use client'

import { useEffect, useState } from 'react'
import { fetchVocabTopics } from '@/lib/api/ielts'
import { VocabContentClient } from '@/components/ielts/VocabContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'

export default function VocabularyPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVocabTopics(1, 100)
      .then((result) => {
        setRows(
          result.items.map((t) => ({
            id: t.id,
            title: t.title,
            meta: `${t.wordCount} words · ${t.difficulty}`,
            status: t.status,
            createdAt: t.createdAt,
          }))
        )
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-5 sm:p-6 text-sm text-muted-foreground">Loading…</p>
  }

  return <VocabContentClient rows={rows} />
}
