import { revalidatePath } from 'next/cache'
import { getCallTopics } from '@/lib/data/calls'
import { createCallTopic, fetchCallTopicById, updateCallTopic, deleteCallTopic } from '@/lib/api/calls'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import { CALL_TOPIC_ICON_OPTIONS } from '@/lib/types/calls'
import type { IeltsStatus } from '@/lib/types/ielts'

export const metadata = { title: 'Call Topics' }

export default async function CallTopicsPage() {
  const topics = await getCallTopics()
  const rows: ContentRow[] = topics.map((t) => ({
    id: t.id,
    title: t.label,
    meta: `${t.icon} · ${t.questions.length} question${t.questions.length !== 1 ? 's' : ''}`,
    status: t.status,
    createdAt: t.createdAt,
  }))

  async function onCreate(data: { title: string; type: string }) {
    'use server'
    const topic = await createCallTopic({ label: data.title, icon: data.type, sortOrder: topics.length })
    revalidatePath('/calls/topics')
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchCallTopicById(id)
    await updateCallTopic(id, { ...current, label: data.title, icon: data.type, status: data.status })
    revalidatePath('/calls/topics')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteCallTopic(id)
    revalidatePath('/calls/topics')
  }

  return (
    <IeltsContentShell
      title="Call Topics"
      description="Manage speaking call topics and discussion prompts."
      rows={rows}
      typeOptions={[...CALL_TOPIC_ICON_OPTIONS]}
      typeLabel="Icon"
      manageHrefPrefix="/calls/topics"
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
