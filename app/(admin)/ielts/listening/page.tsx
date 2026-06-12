import { getListeningTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { toListeningRows } from '@/lib/data/ielts-rows'
import { ListeningContentClient } from '@/components/ielts/ListeningContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

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

  const rows: ContentRow[] = toListeningRows(tests)

  return <ListeningContentClient rows={rows} setFilters={setFilters} createSetOptions={createSetOptions} />
}
