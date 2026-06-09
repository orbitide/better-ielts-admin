import { revalidatePath } from 'next/cache'
import { getSpeakingSessions, getIeltsSets, getFullIeltsSet } from '@/lib/data/ielts'
import { createSpeakingSession, fetchSpeakingSessionById, updateSpeakingSession, deleteSpeakingSession } from '@/lib/api/ielts'
import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'

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

  async function onCreate(data: { title: string; type: string }) {
    'use server'
    const session = await createSpeakingSession({ title: data.title })
    revalidatePath('/ielts/speaking')
    return { id: session.id, createdAt: session.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchSpeakingSessionById(id)
    await updateSpeakingSession(id, { ...current, title: data.title, status: data.status })
    revalidatePath('/ielts/speaking')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteSpeakingSession(id)
    revalidatePath('/ielts/speaking')
  }

  return (
    <IeltsContentShell
      title="Speaking Sessions"
      description="Manage speaking session topics and part questions."
      rows={rows}
      typeOptions={['3-part', '2-part']}
      typeLabel="Format"
      manageHrefPrefix="/ielts/speaking"
      setFilters={setFilters}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
