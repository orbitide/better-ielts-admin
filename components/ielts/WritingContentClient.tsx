'use client'

import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createWritingTask,
  fetchWritingTaskById,
  updateWritingTask,
  deleteWritingTask,
  fetchIeltsSetById,
  updateTestInSet,
} from '@/lib/api/ielts'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function WritingContentClient({ rows, setFilters, createSetOptions }: Props) {
  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const task = await createWritingTask({ title: data.title, type: data.type })

    if (data.setId && data.testId) {
      try {
        const set = await fetchIeltsSetById(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'writing')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'writing' ? { ...s, testId: task.id } : s)
            : [...mockTest.sections, { id: '', skill: 'writing' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 60, testId: task.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    return { id: task.id, createdAt: task.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchWritingTaskById(id)
    await updateWritingTask(id, { ...current, title: data.title, type: data.type as 'task1' | 'task2', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteWritingTask(id)
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
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
