'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import { CALL_TOPIC_ICON_OPTIONS } from '@/lib/types/calls'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchCallTopics,
  createCallTopic,
  fetchCallTopicById,
  updateCallTopic,
  deleteCallTopic,
} from '@/lib/api/calls'

const DEFAULT_PAGE_SIZE = 10

function toRows(topics: Awaited<ReturnType<typeof fetchCallTopics>>['items']): ContentRow[] {
  return topics.map((t) => ({
    id: t.id,
    title: t.label,
    meta: `${t.icon} · ${t.questions.length} question${t.questions.length !== 1 ? 's' : ''}`,
    status: t.status,
    createdAt: t.createdAt,
  }))
}

export function CallTopicsContentClient() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCallTopics(page, pageSize)
      .then((r) => {
        if (cancelled) return
        setRows(toRows(r.items))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load call topics.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [page, pageSize])

  async function onCreate(data: { title: string; type: string }) {
    const topic = await createCallTopic({ label: data.title, icon: data.type, sortOrder: totalCount })
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchCallTopicById(id)
    await updateCallTopic(id, { ...current, label: data.title, icon: data.type, status: data.status })
  }

  async function onDelete(id: string) {
    await deleteCallTopic(id)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <IeltsContentShell
      title="Call Topics"
      description="Manage speaking call topics and discussion prompts."
      rows={rows}
      typeOptions={[...CALL_TOPIC_ICON_OPTIONS]}
      typeLabel="Icon"
      manageHrefPrefix="/calls/topics"
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
