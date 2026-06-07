import { notFound } from 'next/navigation'
import { getFullListeningTest } from '@/lib/data/ielts'
import { ListeningTestDetailShell } from '@/components/ielts/ListeningTestDetailShell'

export default async function ListeningTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const test = await getFullListeningTest(id)
  if (!test) notFound()
  return <ListeningTestDetailShell test={test} />
}
