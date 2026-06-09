import { revalidatePath } from 'next/cache'
import { getVocabTopics } from '@/lib/data/ielts'
import { createVocabTopic, fetchVocabTopicById, updateVocabTopic, deleteVocabTopic } from '@/lib/api/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'

export const metadata = { title: 'Vocabulary Topics' }

export default async function VocabularyPage() {
  const topics = await getVocabTopics()
  const rows: ContentRow[] = topics.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.wordCount} words · ${t.difficulty}`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  async function onCreate(data: { title: string; type: string }) {
    'use server'
    const topic = await createVocabTopic({ title: data.title, difficulty: data.type })
    revalidatePath('/ielts/vocabulary')
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchVocabTopicById(id)
    await updateVocabTopic(id, { ...current, title: data.title, difficulty: data.type as 'beginner' | 'intermediate' | 'advanced', status: data.status })
    revalidatePath('/ielts/vocabulary')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteVocabTopic(id)
    revalidatePath('/ielts/vocabulary')
  }

  return (
    <IeltsContentShell
      title="Vocabulary Topics"
      description="Manage vocabulary topic decks and word lists."
      rows={rows}
      typeOptions={['beginner', 'intermediate', 'advanced']}
      typeLabel="Difficulty"
      manageHrefPrefix="/ielts/vocabulary"
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
