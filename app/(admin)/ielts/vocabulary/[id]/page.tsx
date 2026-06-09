import { notFound } from 'next/navigation'
import { getFullVocabTopic } from '@/lib/data/ielts'
import { VocabTopicDetailShell } from '@/components/ielts/VocabTopicDetailShell'

type Props = { params: Promise<{ id: string }> }

export default async function VocabularyDetailPage({ params }: Props) {
  const { id } = await params
  const topic = await getFullVocabTopic(id)

  if (!topic) notFound()

  return <VocabTopicDetailShell topic={topic} />
}
