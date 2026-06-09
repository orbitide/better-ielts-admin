import { revalidatePath } from 'next/cache'
import { getWritingTasks, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { createWritingTask, fetchWritingTaskById, updateWritingTask, deleteWritingTask } from '@/lib/api/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
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
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.type.toUpperCase()} · ${t.wordMinimum}+ words · ${t.timeMinutes} min`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  async function onCreate(data: { title: string; type: string }) {
    'use server'
    const task = await createWritingTask({ title: data.title, type: data.type })
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
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
