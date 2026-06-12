'use client'

import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchSpeakingSessions,
  createSpeakingSession,
  fetchSpeakingSessionById,
  updateSpeakingSession,
  deleteSpeakingSession,
  fetchFullIeltsSet,
  updateTestInSet,
} from '@/lib/api/ielts'
import { toSpeakingRows } from '@/lib/data/ielts-rows'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function SpeakingContentClient({ rows, setFilters, createSetOptions }: Props) {
  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const session = await createSpeakingSession({ title: data.title })

    if (data.setId && data.testId) {
      try {
        const set = await fetchFullIeltsSet(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'speaking')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'speaking' ? { ...s, testId: session.id } : s)
            : [...mockTest.sections, { id: '', skill: 'speaking' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 15, testId: session.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    return { id: session.id, createdAt: session.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchSpeakingSessionById(id)
    await updateSpeakingSession(id, { ...current, title: data.title, status: data.status })
  }

  async function onDelete(id: string) {
    await deleteSpeakingSession(id)
  }

  async function onFilterChange({ setId, testId }: { setId?: string; testId?: string }) {
    const { items } = await fetchSpeakingSessions(1, 100, undefined, setId, testId)
    return toSpeakingRows(items)
  }

  return (
    <IeltsContentShell
      title="Speaking Sessions"
      description="Manage speaking session topics and part questions."
      rows={rows}
      typeOptions={['3-part', '2-part']}
      typeLabel="Format"
      manageHrefPrefix="/ielts/speaking"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'topic', header: 'Topic' },
        { key: 'parts', header: 'Parts' },
      ]}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onFilterChange={onFilterChange}
    />
  )
}
