import { notFound } from 'next/navigation'
import { getSpeakingSessionDetail, getSpeakingParts } from '@/lib/data/ielts'
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
  const [session, parts] = await Promise.all([getSpeakingSessionDetail(id), getSpeakingParts(id)])
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

  return <SpeakingSessionDetailShell session={session} initialParts={parts ?? []} setContext={setContext} />
}
