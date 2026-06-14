'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchListeningTests,
  createListeningTest,
  fetchListeningTestById,
  updateListeningTest,
  updateListeningStatus,
  deleteListeningTest,
  fetchIeltsSets,
  fetchFullIeltsSet,
  linkContentToTest,
  unlinkContentFromTest,
} from '@/lib/api/ielts'
import { toListeningRows } from '@/lib/data/ielts-rows'

const DEFAULT_PAGE_SIZE = 10

export function ListeningContentClient() {
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
    fetchListeningTests(page, pageSize, undefined, selectedSetId || undefined, selectedTestId || undefined)
      .then((r) => {
        if (cancelled) return
        setRows(toListeningRows(r.items))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load listening tests.')
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
                const section = test.sections.find((s) => s.skill === 'listening')
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
    const test = await createListeningTest({ title: data.title, setId: data.setId, testId: data.testId })
    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) {
    const current = await fetchListeningTestById(id)
    await updateListeningTest(id, { title: data.title, durationMinutes: current.durationMinutes, status: data.status, setId: current.setId, testId: current.testId })

    if (current.setId !== data.setId || current.testId !== data.testId) {
      if (current.setId && current.testId) {
        try { await unlinkContentFromTest(current.setId, current.testId, 'listening', id) } catch { /* best-effort */ }
      }
      if (data.setId && data.testId) {
        try { await linkContentToTest(data.setId, data.testId, 'listening', id) } catch { /* best-effort */ }
      }
    }
  }

  async function onDelete(id: string) {
    await deleteListeningTest(id)
  }

  async function onToggleStatus(id: string, nextStatus: IeltsStatus) {
    return updateListeningStatus(id, nextStatus)
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
      title="Listening Tests"
      description="Manage listening test content and audio."
      rows={rows}
      typeOptions={['standard']}
      typeLabel="Type"
      manageHrefPrefix="/ielts/listening"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'sections', header: 'Sections' },
        { key: 'questions', header: 'Questions' },
        { key: 'audio', header: 'Audio' },
      ]}
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onApiToggleStatus={onToggleStatus}
      onApiGetDetail={async (id) => {
        const d = await fetchListeningTestById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onSetFilterChange={handleSetFilterChange}
      selectedSetId={selectedSetId}
      selectedTestId={selectedTestId}
    />
  )
}
