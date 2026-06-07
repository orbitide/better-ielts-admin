import { getListeningTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Listening Tests' }

export default async function ListeningPage() {
  const [tests, sets] = await Promise.all([getListeningTests(), getIeltsSets()])

  const fullSets = await Promise.all(sets.map((s) => getFullIeltsSet(s.id)))

  const setFilters: SetFilterOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      setId: set!.id,
      setTitle: set!.title,
      tests: set!.tests
        .map((test) => {
          const section = test.sections.find((s) => s.skill === 'listening')
          if (!section) return null
          return { testId: test.id, testTitle: test.title, skillContentId: section.testId }
        })
        .filter(Boolean) as SetFilterOption['tests'],
    }))
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.sectionCount} sections · ${t.questionCount} Qs · ${t.audioUrl ? 'Audio uploaded' : 'No audio'}`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Listening Tests"
      description="Manage listening test content and audio."
      rows={rows}
      typeOptions={['standard']}
      typeLabel="Type"
      manageHrefPrefix="/ielts/listening"
      setFilters={setFilters}
    />
  )
}
