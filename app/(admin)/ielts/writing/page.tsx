'use client'

import { useEffect, useState } from 'react'
import { fetchWritingTasks, fetchIeltsSets, fetchFullIeltsSet } from '@/lib/api/ielts'
import { toWritingRows } from '@/lib/data/ielts-rows'
import { WritingContentClient } from '@/components/ielts/WritingContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

export default function WritingPage() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [setFilters, setSetFilters] = useState<SetFilterOption[]>([])
  const [createSetOptions, setCreateSetOptions] = useState<SetOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [tasksResult, setsResult] = await Promise.all([
        fetchWritingTasks(1, 100).catch(() => ({ items: [] })),
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

      setRows(toWritingRows(tasksResult.items))
      setSetFilters(filters)
      setCreateSetOptions(options)
    }

    load().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-5 sm:p-6 text-sm text-muted-foreground">Loading…</p>
  }

  return <WritingContentClient rows={rows} setFilters={setFilters} createSetOptions={createSetOptions} />
}
