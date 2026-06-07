import { notFound } from 'next/navigation'
import { getFullReadingTest } from '@/lib/data/ielts'
import { ReadingTestDetailShell } from '@/components/ielts/ReadingTestDetailShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function ReadingTestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  const test = await getFullReadingTest(id)
  if (!test) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <ReadingTestDetailShell test={test} setContext={setContext} />
}
