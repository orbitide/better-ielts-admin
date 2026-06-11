'use client'

import { useEffect, useState } from 'react'
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
  fetchIeltsSets,
  fetchIeltsSetById,
  updateTestInSet,
} from '@/lib/api/ielts'
import { toReadingRows } from '@/lib/data/ielts-rows'

export function ReadingContentClient() {
  const [rows, setRows] = useState<ContentRow[]>([])
  const [setFilters, setSetFilters] = useState<SetFilterOption[]>([])
  const [createSetOptions, setCreateSetOptions] = useState<SetOption[]>([])

  useEffect(() => {
    async function loadData() {
      const [testsPage, setsPage] = await Promise.all([
        fetchReadingTests(1, 100),
        fetchIeltsSets(1, 100),
      ])
      setRows(toReadingRows(testsPage.items))

      const fullSets = (await Promise.all(
        setsPage.items.map((s) => fetchIeltsSetById(s.id).catch(() => null))
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
    loadData()
  }, [])

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const test = await createReadingTest({ title: data.title, type: data.type })

    if (data.setId && data.testId) {
      try {
        const set = await fetchIeltsSetById(data.setId)
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
    await updateReadingTest(id, { ...current, title: data.title, type: data.type as 'academic' | 'general', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteReadingTest(id)
  }

  async function onFilterChange({ setId, testId }: { setId?: string; testId?: string }) {
    const { items } = await fetchReadingTests(1, 100, undefined, setId, testId)
    return toReadingRows(items)
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
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onFilterChange={onFilterChange}
    />
  )
}
