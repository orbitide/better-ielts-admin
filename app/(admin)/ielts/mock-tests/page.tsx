import { getMockTests } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Mock Tests' }

export default async function MockTestsPage() {
  const tests = await getMockTests()
  const rows: ContentRow[] = tests.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.type} · ${t.sectionCount} sections · ${t.durationMinutes} min`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Sets"
      description="Manage full test sets — each set groups one Reading, Listening, Writing, and Speaking test."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Exam Type"
      manageHrefPrefix="/ielts/mock-tests"
    />
  )
}
