'use client'

import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createListeningTest,
  fetchListeningTestById,
  updateListeningTest,
  deleteListeningTest,
  fetchIeltsSetById,
  updateTestInSet,
} from '@/lib/api/ielts'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function ListeningContentClient({ rows, setFilters, createSetOptions }: Props) {
  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const test = await createListeningTest({ title: data.title })

    if (data.setId && data.testId) {
      try {
        const set = await fetchIeltsSetById(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'listening')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'listening' ? { ...s, testId: test.id } : s)
            : [...mockTest.sections, { id: '', skill: 'listening' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 40, testId: test.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchListeningTestById(id)
    await updateListeningTest(id, { ...current, title: data.title, status: data.status })
  }

  async function onDelete(id: string) {
    await deleteListeningTest(id)
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
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
