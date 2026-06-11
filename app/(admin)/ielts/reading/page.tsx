import { getReadingTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { ReadingContentClient } from '@/components/ielts/ReadingContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

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

  const createSetOptions: SetOption[] = fullSets
    .filter(Boolean)
    .map((set) => ({
      id: set!.id,
      title: set!.title,
      tests: set!.tests.map((t) => ({ id: t.id, title: t.title })),
    }))
    .filter((s) => s.tests.length > 0)

  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    setName: t.setName,
    testName: t.testName,
    type: t.type,
    stats: { passages: t.passageCount, questions: t.questionCount },
    status: t.status,
    createdAt: t.createdAt,
  }))

  return <ReadingContentClient rows={rows} setFilters={setFilters} createSetOptions={createSetOptions} />
}
