import { notFound } from 'next/navigation'
import { getFullIeltsSet } from '@/lib/data/ielts'
import { SetDetailShell } from '@/components/ielts/SetDetailShell'

export default async function SetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const set = await getFullIeltsSet(id)
  if (!set) notFound()
  return <SetDetailShell set={set} />
}
