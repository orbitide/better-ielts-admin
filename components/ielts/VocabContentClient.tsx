'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchVocabTopics,
  createVocabTopic,
  fetchVocabTopicById,
  updateVocabTopic,
  deleteVocabTopic,
} from '@/lib/api/ielts'

const DEFAULT_PAGE_SIZE = 10

export function VocabContentClient() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchVocabTopics(page, pageSize)
      .then((r) => {
        if (cancelled) return
        setRows(
          r.items.map((t) => ({
            id: t.id,
            title: t.title,
            meta: `${t.wordCount} words · ${t.difficulty}`,
            status: t.status,
            createdAt: t.createdAt,
          }))
        )
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load vocabulary topics.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [page, pageSize])

  async function onCreate(data: { title: string; type: string }) {
    const topic = await createVocabTopic({ title: data.title, difficulty: data.type })
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchVocabTopicById(id)
    await updateVocabTopic(id, { ...current, title: data.title, difficulty: data.type as 'beginner' | 'intermediate' | 'advanced', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteVocabTopic(id)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <IeltsContentShell
      title="Vocabulary Topics"
      description="Manage vocabulary topic decks and word lists."
      rows={rows}
      typeOptions={['beginner', 'intermediate', 'advanced']}
      typeLabel="Difficulty"
      manageHrefPrefix="/ielts/vocabulary"
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
