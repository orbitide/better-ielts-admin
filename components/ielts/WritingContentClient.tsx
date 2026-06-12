'use client'

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
  linkContentToTest,
  unlinkContentFromTest,
} from '@/lib/api/ielts'
import { toWritingRows } from '@/lib/data/ielts-rows'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function WritingContentClient({ rows, setFilters, createSetOptions }: Props) {
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

  async function onFilterChange({ setId, testId }: { setId?: string; testId?: string }) {
    const { items } = await fetchWritingTasks(1, 100, undefined, setId, testId)
    return toWritingRows(items)
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
      onApiGetDetail={async (id) => {
        const d = await fetchWritingTaskById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onFilterChange={onFilterChange}
    />
  )
}
