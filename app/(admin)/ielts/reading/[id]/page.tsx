import { notFound } from 'next/navigation'
import { getReadingTestDetail, getReadingSections } from '@/lib/data/ielts'
import { ReadingTestDetailShell } from '@/components/ielts/ReadingTestDetailShell'
import type { SetContext } from '@/lib/types/ielts'

const SECTIONS_PAGE_SIZE = 10

export default async function ReadingTestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  const test = await getReadingTestDetail(id)
  if (!test) notFound()

  const page = Number(sp.page ?? '1') || 1
  const sectionsPage = await getReadingSections(id, page, SECTIONS_PAGE_SIZE)
  if (!sectionsPage) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <ReadingTestDetailShell test={test} initialSectionsPage={sectionsPage} setContext={setContext} />
}
