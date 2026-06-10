import { notFound } from 'next/navigation'
import { getFullCallTopic } from '@/lib/data/calls'
import { CallTopicDetailShell } from '@/components/calls/CallTopicDetailShell'

type Props = { params: Promise<{ id: string }> }

export default async function CallTopicDetailPage({ params }: Props) {
  const { id } = await params
  const topic = await getFullCallTopic(id)

  if (!topic) notFound()

  return <CallTopicDetailShell topic={topic} />
}
