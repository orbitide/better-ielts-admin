import { getSpeakingSessions } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Speaking Sessions' }

export default async function SpeakingPage() {
  const sessions = await getSpeakingSessions()
  const rows: ContentRow[] = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    meta: `Topic: ${s.topic} · ${s.partCount} parts`,
    status: s.status,
    createdAt: s.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Speaking Sessions"
      description="Manage speaking session topics and part questions."
      rows={rows}
      typeOptions={['3-part', '2-part']}
      typeLabel="Format"
      manageHrefPrefix="/ielts/speaking"
    />
  )
}
