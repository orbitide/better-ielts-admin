import { getReadingTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Reading Tests' }

export default async function ReadingPage() {
  const [tests, sets] = await Promise.all([getReadingTests(), getIeltsSets()])

  const fullSets = await Promise.all(sets.map((s) => getFullIeltsSet(s.id)))

  const setFilters: SetFilterOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      setId: set!.id,
      setTitle: set!.title,
      tests: set!.tests
        .map((test) => {
          const section = test.sections.find((s) => s.skill === 'reading')
          if (!section) return null
          return { testId: test.id, testTitle: test.title, skillContentId: section.testId }
        })
        .filter(Boolean) as SetFilterOption['tests'],
    }))
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.type} · ${t.passageCount} passages · ${t.questionCount} Qs`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Reading Tests"
      description="Manage academic and general training reading tests."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Test Type"
      manageHrefPrefix="/ielts/reading"
      setFilters={setFilters}
    />
  )
}
