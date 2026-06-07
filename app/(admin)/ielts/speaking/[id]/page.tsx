import { notFound } from 'next/navigation'
import { getFullSpeakingSession } from '@/lib/data/ielts'
import { SpeakingSessionDetailShell } from '@/components/ielts/SpeakingSessionDetailShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function SpeakingSessionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  const session = await getFullSpeakingSession(id)
  if (!session) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <SpeakingSessionDetailShell session={session} setContext={setContext} />
}
