import { getIeltsSets } from '@/lib/data/ielts'
import { SetsContentClient } from '@/components/ielts/SetsContentClient'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Sets' }

export default async function SetsPage() {
  const sets = await getIeltsSets()
  const rows: ContentRow[] = sets.map((s) => ({
    id: s.id,
    title: s.title,
    meta: '',
    type: s.type,
    testCount: `${s.testCount} test${s.testCount !== 1 ? 's' : ''}`,
    difficulty: s.difficulty,
    status: s.status,
    createdAt: s.createdAt,
  }))

  return <SetsContentClient rows={rows} />
}
