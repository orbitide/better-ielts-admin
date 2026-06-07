import { getIeltsSets } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Sets' }

export default async function SetsPage() {
  const sets = await getIeltsSets()
  const rows: ContentRow[] = sets.map((s) => ({
    id: s.id,
    title: s.title,
    meta: `${s.type} · ${s.testCount} test${s.testCount !== 1 ? 's' : ''} · ${s.difficulty}`,
    status: s.status,
    createdAt: s.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Sets"
      description="Manage test sets — each set groups multiple complete IELTS tests (Test 1, Test 2…)."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Exam Type"
      manageHrefPrefix="/ielts/mock-tests"
    />
  )
}
