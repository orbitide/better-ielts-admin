import { getReadingTests } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Reading Tests' }

export default async function ReadingPage() {
  const tests = await getReadingTests()
  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.type} · ${t.passageCount} passages · ${t.questionCount} Qs`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Reading Tests"
      description="Manage academic and general training reading tests."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Test Type"
      manageHrefPrefix="/ielts/reading"
    />
  )
}
