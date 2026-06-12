'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import { Loading } from '@/components/ui/Loading'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchReadingTests,
  createReadingTest,
  fetchReadingTestById,
  updateReadingTest,
  deleteReadingTest,
  fetchIeltsSets,
  fetchFullIeltsSet,
  updateTestInSet,
} from '@/lib/api/ielts'
import { toReadingRows } from '@/lib/data/ielts-rows'

const DEFAULT_PAGE_SIZE = 10

export function ReadingContentClient() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [setFilters, setSetFilters] = useState<SetFilterOption[]>([])
  const [createSetOptions, setCreateSetOptions] = useState<SetOption[]>([])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')

  useEffect(() => {
    async function loadFilters() {
      const setsPage = await fetchIeltsSets(1, 100)

      const fullSets = (await Promise.all(
        setsPage.items.map((s) => fetchFullIeltsSet(s.id).catch(() => null))
      )).filter((s): s is NonNullable<typeof s> => s !== null)

      setSetFilters(fullSets.map((set) => ({
        setId: set.id,
        setTitle: set.title,
        tests: set.tests
          .map((test) => {
            const section = test.sections.find((sec) => sec.skill === 'reading')
            if (!section) return null
            return { testId: test.id, testTitle: test.title, skillContentId: section.testId }
          })
          .filter(Boolean) as SetFilterOption['tests'],
      })))

      setCreateSetOptions(
        fullSets
          .map((set) => ({
            id: set.id,
            title: set.title,
            tests: set.tests.map((t) => ({ id: t.id, title: t.title })),
          }))
          .filter((s) => s.tests.length > 0)
      )
    }
    loadFilters()
  }, [])

  useEffect(() => {
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
      try {
        const set = await fetchFullIeltsSet(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'reading')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'reading' ? { ...s, testId: test.id } : s)
            : [...mockTest.sections, { id: '', skill: 'reading' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 60, testId: test.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchReadingTestById(id)
    await updateReadingTest(id, { title: data.title, type: data.type, durationMinutes: current.durationMinutes, status: data.status })
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

  if (loading && rows.length === 0) return <Loading />

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
      onSetFilterChange={handleSetFilterChange}
      selectedSetId={selectedSetId}
      selectedTestId={selectedTestId}
    />
  )
}
