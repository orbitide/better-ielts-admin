import { getCallTopics } from '@/lib/data/calls'
import { CallTopicsContentClient } from '@/components/calls/CallTopicsContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Call Topics' }

export default async function CallTopicsPage() {
  const topics = await getCallTopics()
  const rows: ContentRow[] = topics.map((t) => ({
    id: t.id,
    title: t.label,
    meta: `${t.icon} · ${t.questions.length} question${t.questions.length !== 1 ? 's' : ''}`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return <CallTopicsContentClient rows={rows} topicCount={topics.length} />
}
