'use client'

import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  createIeltsSet,
  fetchIeltsSetById,
  updateIeltsSet,
  deleteIeltsSet,
} from '@/lib/api/ielts'

type Props = {
  rows: ContentRow[]
}

export function SetsContentClient({ rows }: Props) {
  async function onCreate(data: { title: string; type: string }) {
    const set = await createIeltsSet({ title: data.title, type: data.type })
    return { id: set.id, createdAt: set.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    const current = await fetchIeltsSetById(id)
    await updateIeltsSet(id, { ...current, title: data.title, type: data.type as 'academic' | 'general', status: data.status })
  }

  async function onDelete(id: string) {
    await deleteIeltsSet(id)
  }

  return (
    <IeltsContentShell
      title="Sets"
      description="Manage test sets — each set groups multiple complete IELTS tests (Test 1, Test 2…)."
      rows={rows}
      typeOptions={['academic', 'general']}
      typeLabel="Exam Type"
      manageHrefPrefix="/ielts/mock-tests"
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
    />
  )
}
