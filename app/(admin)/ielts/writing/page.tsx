import { getWritingTasks, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

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

  return (
    <IeltsContentShell
      title="Writing Tasks"
      description="Manage Task 1 and Task 2 writing prompts."
      rows={rows}
      typeOptions={['task1', 'task2']}
      typeLabel="Task Type"
      manageHrefPrefix="/ielts/writing"
      setFilters={setFilters}
    />
  )
}
