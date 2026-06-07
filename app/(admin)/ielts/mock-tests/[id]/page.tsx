import { notFound } from 'next/navigation'
import { getFullMockTest } from '@/lib/data/ielts'
import { MockTestDetailShell } from '@/components/ielts/MockTestDetailShell'

export default async function MockTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const test = await getFullMockTest(id)
  if (!test) notFound()
  return <MockTestDetailShell test={test} />
}
