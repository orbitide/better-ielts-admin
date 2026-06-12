import { getSpeakingSessions, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { toSpeakingRows } from '@/lib/data/ielts-rows'
import { SpeakingContentClient } from '@/components/ielts/SpeakingContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

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
          return { testId: test.id, testTitle: test.title, skillContentId: section.contentId }
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

  const rows: ContentRow[] = toSpeakingRows(sessions)

  return <SpeakingContentClient rows={rows} setFilters={setFilters} createSetOptions={createSetOptions} />
}
