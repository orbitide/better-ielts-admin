'use client'

import { useEffect, useState } from 'react'
import { fetchReadingTests, fetchIeltsSets, fetchFullIeltsSet } from '@/lib/api/ielts'
import { toReadingRows } from '@/lib/data/ielts-rows'
import { ReadingContentClient } from '@/components/ielts/ReadingContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

const DEFAULT_PAGE_SIZE = 10

export default function ReadingPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [setFilters, setSetFilters] = useState<SetFilterOption[]>([])
  const [createSetOptions, setCreateSetOptions] = useState<SetOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [testsPage, setsResult] = await Promise.all([
        fetchReadingTests(1, DEFAULT_PAGE_SIZE),
        fetchIeltsSets(1, 100).catch(() => ({ items: [] })),
      ])

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
              const section = test.sections.find((s) => s.skill === 'reading')
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

      setRows(toReadingRows(testsPage.items))
      setPage(testsPage.page)
      setPageSize(testsPage.pageSize)
      setTotalPages(testsPage.totalPages)
      setTotalCount(testsPage.totalCount)
      setSetFilters(filters)
      setCreateSetOptions(options)
    }

    load().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-5 sm:p-6 text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <ReadingContentClient
      initialRows={rows}
      initialPage={page}
      initialPageSize={pageSize}
      initialTotalPages={totalPages}
      initialTotalCount={totalCount}
      setFilters={setFilters}
      createSetOptions={createSetOptions}
    />
  )
}
