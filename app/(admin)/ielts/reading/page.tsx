import { getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { fetchReadingTests } from '@/lib/api/ielts'
import { toReadingRows } from '@/lib/data/ielts-rows'
import { ReadingContentClient } from '@/components/ielts/ReadingContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { SetOption } from '@/components/ielts/ContentFormModal'

export const metadata = { title: 'Reading Tests' }

const DEFAULT_PAGE_SIZE = 10

export default async function ReadingPage() {
  const [testsPage, sets] = await Promise.all([
    fetchReadingTests(1, DEFAULT_PAGE_SIZE),
    getIeltsSets(),
  ])

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

  const rows: ContentRow[] = toReadingRows(testsPage.items)

  return (
    <ReadingContentClient
      initialRows={rows}
      initialPage={testsPage.page}
      initialPageSize={testsPage.pageSize}
      initialTotalPages={testsPage.totalPages}
      initialTotalCount={testsPage.totalCount}
      setFilters={setFilters}
      createSetOptions={createSetOptions}
    />
  )
}
