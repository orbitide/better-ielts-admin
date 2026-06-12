'use client'

import { useEffect, useState } from 'react'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import { Loading } from '@/components/ui/Loading'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchIeltsSets,
  createIeltsSet,
  fetchIeltsSetById,
  updateIeltsSet,
  deleteIeltsSet,
} from '@/lib/api/ielts'

const DEFAULT_PAGE_SIZE = 10

const SetsPage = () => {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const r = await fetchIeltsSets(page, pageSize)
        if (cancelled) return
        setRows(r.items.map((s) => ({
          id: s.id,
          title: s.title,
          meta: '',
          type: s.type,
          testCount: `${s.testCount} test${s.testCount !== 1 ? 's' : ''}`,
          difficulty: s.difficulty,
          status: s.status,
          createdAt: s.createdAt,
        })))
        setTotalPages(r.totalPages)
        setTotalCount(r.totalCount)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [page, pageSize])

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  async function onCreate(data: { title: string; type: string }) {
    const set = await createIeltsSet({ title: data.title, type: data.type })
    return { id: set.id, createdAt: set.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchIeltsSetById(id)
    await updateIeltsSet(id, { ...current, title: data.title, type: data.type as 'academic' | 'general', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteIeltsSet(id)
  }

  if (loading && rows.length === 0) return <Loading />

  return (
    <IeltsContentShell
      title="Sets"
      description="Manage test sets — each set groups multiple complete IELTS tests (Test 1, Test 2…)."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Exam Type"
      manageHrefPrefix="/ielts/mock-tests"
      pagination={{ page, pageSize, totalPages, totalCount, loading, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}

export default SetsPage
