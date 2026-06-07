import { notFound } from 'next/navigation'
import { getFullListeningTest } from '@/lib/data/ielts'
import { ListeningSectionShell } from '@/components/ielts/ListeningSectionShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function ListeningSectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; sectionId: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id, sectionId } = await params
  const sp = await searchParams
  const test = await getFullListeningTest(id)
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

  return <ListeningSectionShell test={test} section={section} setContext={setContext} />
}
