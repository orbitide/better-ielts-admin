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
      title="Mock Tests"
      description="Manage full mock examinations (all 4 skills)."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Exam Type"
    />
  )
}
