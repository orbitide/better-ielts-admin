import { notFound } from 'next/navigation'
import { getFullSpeakingSession } from '@/lib/data/ielts'
import { SpeakingSessionDetailShell } from '@/components/ielts/SpeakingSessionDetailShell'

export default async function SpeakingSessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getFullSpeakingSession(id)
  if (!session) notFound()
  return <SpeakingSessionDetailShell session={session} />
}
