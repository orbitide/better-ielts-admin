import { notFound } from 'next/navigation'
import { getFullListeningTest } from '@/lib/data/ielts'
import { ListeningTestDetailShell } from '@/components/ielts/ListeningTestDetailShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function ListeningTestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  const test = await getFullListeningTest(id)
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

  return <ListeningTestDetailShell test={test} setContext={setContext} />
}
