import { notFound } from 'next/navigation'
import { getFullWritingTask } from '@/lib/data/ielts'
import { WritingTaskDetailShell } from '@/components/ielts/WritingTaskDetailShell'

export default async function WritingTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await getFullWritingTask(id)
  if (!task) notFound()
  return <WritingTaskDetailShell task={task} />
}
