import { notFound } from 'next/navigation'
import { getFullReadingTest } from '@/lib/data/ielts'
import { ReadingSectionShell } from '@/components/ielts/ReadingSectionShell'

export default async function ReadingSectionDetailPage({ params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { id, sectionId } = await params
  const test = await getFullReadingTest(id)
  if (!test) notFound()
  const section = test.sections.find((s) => s.id === sectionId)
  if (!section) notFound()
  return <ReadingSectionShell test={test} section={section} />
}
