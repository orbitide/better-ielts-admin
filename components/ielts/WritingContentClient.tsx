'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchWritingTasks,
  createWritingTask,
  fetchWritingTaskById,
  updateWritingTask,
  deleteWritingTask,
  fetchIeltsSets,
  fetchFullIeltsSet,
  linkContentToTest,
  unlinkContentFromTest,
} from '@/lib/api/ielts'
import { toWritingRows } from '@/lib/data/ielts-rows'

const DEFAULT_PAGE_SIZE = 10

export function WritingContentClient() {
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
    fetchWritingTasks(page, pageSize, undefined, selectedSetId || undefined, selectedTestId || undefined)
      .then((r) => {
        if (cancelled) return
        setRows(toWritingRows(r.items))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load writing tasks.')
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
                const section = test.sections.find((s) => s.skill === 'writing')
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
    const task = await createWritingTask({ title: data.title, type: data.type })

    if (data.setId && data.testId) {
      try { await linkContentToTest(data.setId, data.testId, 'writing', task.id) } catch { /* best-effort */ }
    }

    return { id: task.id, createdAt: task.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) {
    const current = await fetchWritingTaskById(id)
    await updateWritingTask(id, { ...current, title: data.title, type: data.type as 'task1' | 'task2', status: data.status })

    if (current.setId !== data.setId || current.testId !== data.testId) {
      if (current.setId && current.testId) {
        try { await unlinkContentFromTest(current.setId, current.testId, 'writing', id) } catch { /* best-effort */ }
      }
      if (data.setId && data.testId) {
        try { await linkContentToTest(data.setId, data.testId, 'writing', id) } catch { /* best-effort */ }
      }
    }
  }

  async function onDelete(id: string) {
    await deleteWritingTask(id)
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
      title="Writing Tasks"
      description="Manage Task 1 and Task 2 writing prompts."
      rows={rows}
      typeOptions={['task1', 'task2']}
      typeLabel="Task Type"
      manageHrefPrefix="/ielts/writing"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'minWords', header: 'Min Words' },
        { key: 'time', header: 'Time' },
      ]}
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onApiGetDetail={async (id) => {
        const d = await fetchWritingTaskById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onSetFilterChange={handleSetFilterChange}
      selectedSetId={selectedSetId}
      selectedTestId={selectedTestId}
    />
  )
}
