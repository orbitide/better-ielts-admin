'use client'

import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createVocabTopic,
  fetchVocabTopicById,
  updateVocabTopic,
  deleteVocabTopic,
} from '@/lib/api/ielts'

type Props = {
  rows: ContentRow[]
}

export function VocabContentClient({ rows }: Props) {
  async function onCreate(data: { title: string; type: string }) {
    const topic = await createVocabTopic({ title: data.title, difficulty: data.type })
    return { id: topic.id, createdAt: topic.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchVocabTopicById(id)
    await updateVocabTopic(id, { ...current, title: data.title, difficulty: data.type as 'beginner' | 'intermediate' | 'advanced', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteVocabTopic(id)
  }

  return (
    <IeltsContentShell
      title="Vocabulary Topics"
      description="Manage vocabulary topic decks and word lists."
      rows={rows}
      typeOptions={['beginner', 'intermediate', 'advanced']}
      typeLabel="Difficulty"
      manageHrefPrefix="/ielts/vocabulary"
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
