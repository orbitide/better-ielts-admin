import { getVocabTopics } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
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

  return (
    <IeltsContentShell
      title="Vocabulary Topics"
      description="Manage vocabulary topic decks and word lists."
      rows={rows}
      typeOptions={['beginner', 'intermediate', 'advanced']}
      typeLabel="Difficulty"
    />
  )
}
