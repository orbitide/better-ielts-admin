import { notFound } from 'next/navigation'
import { getFullReadingTest } from '@/lib/data/ielts'
import { ReadingSectionShell } from '@/components/ielts/ReadingSectionShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function ReadingSectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; sectionId: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id, sectionId } = await params
  const sp = await searchParams
  const test = await getFullReadingTest(id)
  if (!test) notFound()
  const section = test.sections.find((s) => s.id === sectionId)
  if (!section) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <ReadingSectionShell test={test} section={section} setContext={setContext} />
}
