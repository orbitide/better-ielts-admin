'use client'

import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import { CALL_TOPIC_ICON_OPTIONS } from '@/lib/types/calls'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createCallTopic,
  fetchCallTopicById,
  updateCallTopic,
  deleteCallTopic,
} from '@/lib/api/calls'

type Props = {
  rows: ContentRow[]
  topicCount: number
}

export function CallTopicsContentClient({ rows, topicCount }: Props) {
  async function onCreate(data: { title: string; type: string }) {
    const topic = await createCallTopic({ label: data.title, icon: data.type, sortOrder: topicCount })
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchCallTopicById(id)
    await updateCallTopic(id, { ...current, label: data.title, icon: data.type, status: data.status })
  }

  async function onDelete(id: string) {
    await deleteCallTopic(id)
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
