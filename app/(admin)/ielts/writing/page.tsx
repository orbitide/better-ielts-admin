import { revalidatePath } from 'next/cache'
import { getWritingTasks, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { createWritingTask, fetchWritingTaskById, updateWritingTask, deleteWritingTask, fetchIeltsSetById, updateTestInSet } from '@/lib/api/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'

export const metadata = { title: 'Writing Tasks' }

export default async function WritingPage() {
  const [tasks, sets] = await Promise.all([getWritingTasks(), getIeltsSets()])

  const fullSets = await Promise.all(sets.map((s) => getFullIeltsSet(s.id)))

  const setFilters: SetFilterOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      setId: set!.id,
      setTitle: set!.title,
      tests: set!.tests
        .map((test) => {
          const section = test.sections.find((s) => s.skill === 'writing')
          if (!section) return null
          return { testId: test.id, testTitle: test.title, skillContentId: section.testId }
        })
        .filter(Boolean) as SetFilterOption['tests'],
    }))

  const createSetOptions: SetOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      id: set!.id,
      title: set!.title,
      tests: set!.tests.map((t) => ({ id: t.id, title: t.title })),
    }))
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    stats: { minWords: `${t.wordMinimum}+`, time: `${t.timeMinutes} min` },
    status: t.status,
    createdAt: t.createdAt,
  }))

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    'use server'
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

    revalidatePath('/ielts/writing')
    return { id: task.id, createdAt: task.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchWritingTaskById(id)
    await updateWritingTask(id, { ...current, title: data.title, type: data.type as 'task1' | 'task2', status: data.status })
    revalidatePath('/ielts/writing')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteWritingTask(id)
    revalidatePath('/ielts/writing')
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
