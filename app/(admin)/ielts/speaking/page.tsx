import { getSpeakingSessions, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Speaking Sessions' }

export default async function SpeakingPage() {
  const [sessions, sets] = await Promise.all([getSpeakingSessions(), getIeltsSets()])

  const fullSets = await Promise.all(sets.map((s) => getFullIeltsSet(s.id)))

  const setFilters: SetFilterOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      setId: set!.id,
      setTitle: set!.title,
      tests: set!.tests
        .map((test) => {
          const section = test.sections.find((s) => s.skill === 'speaking')
          if (!section) return null
          return { testId: test.id, testTitle: test.title, skillContentId: section.testId }
        })
        .filter(Boolean) as SetFilterOption['tests'],
    }))
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    meta: `Topic: ${s.topic} · ${s.partCount} parts`,
    status: s.status,
    createdAt: s.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Speaking Sessions"
      description="Manage speaking session topics and part questions."
      rows={rows}
      typeOptions={['3-part', '2-part']}
      typeLabel="Format"
      manageHrefPrefix="/ielts/speaking"
      setFilters={setFilters}
    />
  )
}
