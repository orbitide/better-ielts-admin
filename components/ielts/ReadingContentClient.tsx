'use client'

import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createReadingTest,
  fetchReadingTestById,
  updateReadingTest,
  deleteReadingTest,
  fetchIeltsSetById,
  updateTestInSet,
} from '@/lib/api/ielts'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function ReadingContentClient({ rows, setFilters, createSetOptions }: Props) {
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
    />
  )
}
