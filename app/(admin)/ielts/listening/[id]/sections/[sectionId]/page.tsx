import { notFound } from 'next/navigation'
import { getFullListeningTest } from '@/lib/data/ielts'
import { ListeningSectionShell } from '@/components/ielts/ListeningSectionShell'

export default async function ListeningSectionDetailPage({ params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { id, sectionId } = await params
  const test = await getFullListeningTest(id)
  if (!test) notFound()
  const section = test.sections.find((s) => s.id === sectionId)
  if (!section) notFound()
  return <ListeningSectionShell test={test} section={section} />
}
