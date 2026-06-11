import { notFound } from 'next/navigation'
import { getReadingTestDetail, getReadingSectionDetail, getReadingQuestions } from '@/lib/data/ielts'
import { ReadingSectionShell } from '@/components/ielts/ReadingSectionShell'
import type { SetContext } from '@/lib/types/ielts'

const QUESTIONS_PAGE_SIZE = 20

export default async function ReadingSectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; sectionId: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id, sectionId } = await params
  const sp = await searchParams

  const test = await getReadingTestDetail(id)
  if (!test) notFound()

  const section = await getReadingSectionDetail(sectionId)
  if (!section) notFound()

  const page = Number(sp.page ?? '1') || 1
  const questionsPage = await getReadingQuestions(sectionId, page, QUESTIONS_PAGE_SIZE)
  if (!questionsPage) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <ReadingSectionShell test={test} section={section} initialQuestionsPage={questionsPage} setContext={setContext} />
}
