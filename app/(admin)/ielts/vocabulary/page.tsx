import { getVocabTopics } from '@/lib/data/ielts'
import { VocabContentClient } from '@/components/ielts/VocabContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'

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

  return <VocabContentClient rows={rows} />
}
