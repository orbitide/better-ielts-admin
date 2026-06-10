import { revalidatePath } from 'next/cache'
import { getListeningTests, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { createListeningTest, fetchListeningTestById, updateListeningTest, deleteListeningTest, fetchIeltsSetById, updateTestInSet } from '@/lib/api/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'

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
    stats: { sections: t.sectionCount, questions: t.questionCount, audio: t.audioUrl ? 'Uploaded' : 'Missing' },
    status: t.status,
    createdAt: t.createdAt,
  }))

  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    'use server'
    const test = await createListeningTest({ title: data.title })

    if (data.setId && data.testId) {
      try {
        const set = await fetchIeltsSetById(data.setId)
        const mockTest = set.tests.find((t) => t.id === data.testId)
        if (mockTest) {
          const existing = mockTest.sections.find((s) => s.skill === 'listening')
          const updatedSections = existing
            ? mockTest.sections.map((s) => s.skill === 'listening' ? { ...s, testId: test.id } : s)
            : [...mockTest.sections, { id: '', skill: 'listening' as const, orderIndex: mockTest.sections.length + 1, durationMinutes: 40, testId: test.id }]
          await updateTestInSet(data.testId, data.setId, { ...mockTest, sections: updatedSections })
        }
      } catch { /* linking is best-effort */ }
    }

    revalidatePath('/ielts/listening')
    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchListeningTestById(id)
    await updateListeningTest(id, { ...current, title: data.title, status: data.status })
    revalidatePath('/ielts/listening')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteListeningTest(id)
    revalidatePath('/ielts/listening')
  }

  return (
    <IeltsContentShell
      title="Listening Tests"
      description="Manage listening test content and audio."
      rows={rows}
      typeOptions={['standard']}
      typeLabel="Type"
      manageHrefPrefix="/ielts/listening"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'sections', header: 'Sections' },
        { key: 'questions', header: 'Questions' },
        { key: 'audio', header: 'Audio' },
      ]}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
