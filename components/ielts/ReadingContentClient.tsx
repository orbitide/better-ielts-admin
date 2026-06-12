'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchReadingTests,
  createReadingTest,
  fetchReadingTestById,
  updateReadingTest,
  deleteReadingTest,
  linkContentToTest,
  unlinkContentFromTest,
} from '@/lib/api/ielts'
import { toReadingRows } from '@/lib/data/ielts-rows'

type Props = {
  initialRows: ContentRow[]
  initialPage: number
  initialPageSize: number
  initialTotalPages: number
  initialTotalCount: number
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function ReadingContentClient({
  initialRows,
  initialPage,
  initialPageSize,
  initialTotalPages,
  initialTotalCount,
  setFilters,
  createSetOptions,
}: Props) {
  const [rows, setRows] = useState<ContentRow[]>(initialRows)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [loading, setLoading] = useState(false)

  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')
  const skipInitialFetch = useRef(true)

  useEffect(() => {
    if (
      skipInitialFetch.current &&
      page === initialPage &&
      pageSize === initialPageSize &&
      !selectedSetId &&
      !selectedTestId
    ) {
      skipInitialFetch.current = false
      return
    }
    skipInitialFetch.current = false

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const r = await fetchReadingTests(page, pageSize, undefined, selectedSetId || undefined, selectedTestId || undefined)
        if (cancelled) return
        setRows(toReadingRows(r.items))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      } catch (err) {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load reading tests.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [page, pageSize, selectedSetId, selectedTestId])

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const test = await createReadingTest({ title: data.title, type: data.type })

    if (data.setId && data.testId) {
      try { await linkContentToTest(data.setId, data.testId, 'reading', test.id) } catch { /* best-effort */ }
    }

    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) {
    const current = await fetchReadingTestById(id)
    await updateReadingTest(id, { title: data.title, type: data.type, durationMinutes: current.durationMinutes, status: data.status })

    if (current.setId !== data.setId || current.testId !== data.testId) {
      if (current.setId && current.testId) {
        try { await unlinkContentFromTest(current.setId, current.testId, 'reading', id) } catch { /* best-effort */ }
      }
      if (data.setId && data.testId) {
        try { await linkContentToTest(data.setId, data.testId, 'reading', id) } catch { /* best-effort */ }
      }
    }
  }

  async function onDelete(id: string) {
    await deleteReadingTest(id)
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
      title="Reading Tests"
      description="Manage academic and general training reading tests."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Test Type"
      manageHrefPrefix="/ielts/reading"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'passages', header: 'Passages' },
        { key: 'questions', header: 'Questions' },
      ]}
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onApiGetDetail={async (id) => {
        const d = await fetchReadingTestById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onSetFilterChange={handleSetFilterChange}
      selectedSetId={selectedSetId}
      selectedTestId={selectedTestId}
    />
  )
}
