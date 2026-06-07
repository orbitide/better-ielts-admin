import { getListeningTests } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Listening Tests' }

export default async function ListeningPage() {
  const tests = await getListeningTests()
  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.sectionCount} sections · ${t.questionCount} Qs · ${t.audioUrl ? 'Audio uploaded' : 'No audio'}`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Listening Tests"
      description="Manage listening test content and audio."
      rows={rows}
      typeOptions={['standard']}
      typeLabel="Type"
      manageHrefPrefix="/ielts/listening"
    />
  )
}
