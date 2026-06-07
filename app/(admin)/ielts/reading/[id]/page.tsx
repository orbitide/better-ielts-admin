import { notFound } from 'next/navigation'
import { getFullReadingTest } from '@/lib/data/ielts'
import { ReadingTestDetailShell } from '@/components/ielts/ReadingTestDetailShell'

export default async function ReadingTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const test = await getFullReadingTest(id)
  if (!test) notFound()
  return <ReadingTestDetailShell test={test} />
}
