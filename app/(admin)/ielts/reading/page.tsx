import { revalidatePath } from 'next/cache'
import { getReadingTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { createReadingTest, fetchReadingTestById, updateReadingTest, deleteReadingTest, fetchIeltsSetById, updateTestInSet } from '@/lib/api/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'

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

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    'use server'
    const test = await createReadingTest({ title: data.title, type: data.type })

    if (data.setId && data.testId) {
      try {
        const set = await fetchIeltsSetById(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'reading')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'reading' ? { ...s, testId: test.id } : s)
            : [...mockTest.sections, { id: '', skill: 'reading' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 60, testId: test.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    revalidatePath('/ielts/reading')
    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchReadingTestById(id)
    await updateReadingTest(id, { ...current, title: data.title, type: data.type as 'academic' | 'general', status: data.status })
    revalidatePath('/ielts/reading')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteReadingTest(id)
    revalidatePath('/ielts/reading')
  }

  return (
    <IeltsContentShell
      title="Reading Tests"
      description="Manage academic and general training reading tests."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Test Type"
      manageHrefPrefix="/ielts/reading"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'passages', header: 'Passages' },
        { key: 'questions', header: 'Questions' },
      ]}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
