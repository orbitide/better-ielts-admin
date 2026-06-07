import { getWritingTasks } from '@/lib/data/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'

export const metadata = { title: 'Writing Tasks' }

export default async function WritingPage() {
  const tasks = await getWritingTasks()
  const rows: ContentRow[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.type.toUpperCase()} · ${t.wordMinimum}+ words · ${t.timeMinutes} min`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  return (
    <IeltsContentShell
      title="Writing Tasks"
      description="Manage Task 1 and Task 2 writing prompts."
      rows={rows}
      typeOptions={['task1', 'task2']}
      typeLabel="Task Type"
      manageHrefPrefix="/ielts/writing"
    />
  )
}
