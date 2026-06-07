import { notFound } from 'next/navigation'
import { getFullWritingTask } from '@/lib/data/ielts'
import { WritingTaskDetailShell } from '@/components/ielts/WritingTaskDetailShell'
import type { SetContext } from '@/lib/types/ielts'

export default async function WritingTaskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { id } = await params
  const sp = await searchParams
  const task = await getFullWritingTask(id)
  if (!task) notFound()

  const setContext: SetContext | undefined =
    sp.setId && sp.setTitle && sp.testId && sp.testIndex
      ? {
          setId: sp.setId,
          setTitle: decodeURIComponent(sp.setTitle),
          testId: sp.testId,
          testIndex: Number(sp.testIndex),
        }
      : undefined

  return <WritingTaskDetailShell task={task} setContext={setContext} />
}
