'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchSpeakingSessions,
  createSpeakingSession,
  fetchSpeakingSessionById,
  updateSpeakingSession,
  updateSpeakingStatus,
  deleteSpeakingSession,
  fetchIeltsSets,
  fetchFullIeltsSet,
} from '@/lib/api/ielts'
import { toSpeakingRows } from '@/lib/data/ielts-rows'

const DEFAULT_PAGE_SIZE = 10

export function SpeakingContentClient() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [setFilters, setSetFilters] = useState<SetFilterOption[]>([])
  const [createSetOptions, setCreateSetOptions] = useState<SetOption[]>([])
  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchSpeakingSessions(page, pageSize, undefined, selectedSetId || undefined, selectedTestId || undefined)
      .then((r) => {
        if (cancelled) return
        setRows(toSpeakingRows(r.items))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load speaking sessions.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [page, pageSize, selectedSetId, selectedTestId])

  useEffect(() => {
    fetchIeltsSets(1, 100)
      .then(async (setsResult) => {
        const fullSets = await Promise.all(
          setsResult.items.map((s) => fetchFullIeltsSet(s.id).catch(() => undefined))
        )

        const filters: SetFilterOption[] = fullSets
          .filter(Boolean)
          .map((set) => ({
            setId: set!.id,
            setTitle: set!.title,
            tests: set!.tests
              .map((test) => {
                const section = test.sections.find((s) => s.skill === 'speaking')
                if (!section) return null
                return { testId: test.id, testTitle: test.title, skillContentId: section.contentId }
              })
              .filter(Boolean) as SetFilterOption['tests'],
          }))

        const options: SetOption[] = fullSets
          .filter(Boolean)
          .map((set) => ({
            id: set!.id,
            title: set!.title,
            tests: set!.tests.map((t) => ({ id: t.id, title: t.title })),
          }))
          .filter((s) => s.tests.length > 0)

        setSetFilters(filters)
        setCreateSetOptions(options)
      })
      .catch(() => {})
  }, [])

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const session = await createSpeakingSession({ title: data.title, setId: data.setId, testId: data.testId })
    return { id: session.id, createdAt: session.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) {
    const current = await fetchSpeakingSessionById(id)
    await updateSpeakingSession(id, { ...current, title: data.title, status: data.status, setId: data.setId, testId: data.testId })
  }

  async function onDelete(id: string) {
    await deleteSpeakingSession(id)
  }

  async function onToggleStatus(id: string, nextStatus: IeltsStatus) {
    return updateSpeakingStatus(id, nextStatus)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const handleSetFilterChange = ({ setId, testId }: { setId?: string; testId?: string }) => {
    const newSetId = setId ?? ''
    const newTestId = testId ?? ''
    if (newSetId === selectedSetId && newTestId === selectedTestId) return
    setSelectedSetId(newSetId)
    setSelectedTestId(newTestId)
    setPage(1)
  }

  return (
    <IeltsContentShell
      title="Speaking Sessions"
      description="Manage speaking session topics and part questions."
      rows={rows}
      typeOptions={['3-part', '2-part']}
      typeLabel="Format"
      manageHrefPrefix="/ielts/speaking"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'topic', header: 'Topic' },
        { key: 'parts', header: 'Parts' },
      ]}
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onApiToggleStatus={onToggleStatus}
      onApiGetDetail={async (id) => {
        const d = await fetchSpeakingSessionById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onSetFilterChange={handleSetFilterChange}
      selectedSetId={selectedSetId}
      selectedTestId={selectedTestId}
    />
  )
}
