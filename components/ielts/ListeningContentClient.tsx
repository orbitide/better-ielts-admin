'use client'

import { IeltsContentShell, type SetFilterOption } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { SetOption } from '@/components/ielts/ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'
import {
  fetchListeningTests,
  createListeningTest,
  fetchListeningTestById,
  updateListeningTest,
  deleteListeningTest,
  linkContentToTest,
  unlinkContentFromTest,
} from '@/lib/api/ielts'
import { toListeningRows } from '@/lib/data/ielts-rows'

type Props = {
  rows: ContentRow[]
  setFilters: SetFilterOption[]
  createSetOptions: SetOption[]
}

export function ListeningContentClient({ rows, setFilters, createSetOptions }: Props) {
  async function onCreate(data: { title: string; type: string; setId?: string; testId?: string }) {
    const test = await createListeningTest({ title: data.title })

    if (data.setId && data.testId) {
      try { await linkContentToTest(data.setId, data.testId, 'listening', test.id) } catch { /* best-effort */ }
    }

    return { id: test.id, createdAt: test.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) {
    const current = await fetchListeningTestById(id)
    await updateListeningTest(id, { ...current, title: data.title, status: data.status })

    if (current.setId !== data.setId || current.testId !== data.testId) {
      if (current.setId && current.testId) {
        try { await unlinkContentFromTest(current.setId, current.testId, 'listening', id) } catch { /* best-effort */ }
      }
      if (data.setId && data.testId) {
        try { await linkContentToTest(data.setId, data.testId, 'listening', id) } catch { /* best-effort */ }
      }
    }
  }

  async function onDelete(id: string) {
    await deleteListeningTest(id)
  }

  async function onFilterChange({ setId, testId }: { setId?: string; testId?: string }) {
    const { items } = await fetchListeningTests(1, 100, undefined, setId, testId)
    return toListeningRows(items)
  }

  return (
    <IeltsContentShell
      title="Listening Tests"
      description="Manage listening test content and audio."
      rows={rows}
      typeOptions={['standard']}
      typeLabel="Type"
      manageHrefPrefix="/ielts/listening"
      setFilters={setFilters}
      createSetOptions={createSetOptions}
      statsColumns={[
        { key: 'sections', header: 'Sections' },
        { key: 'questions', header: 'Questions' },
        { key: 'audio', header: 'Audio' },
      ]}
      onApiCreate={onCreate}
      onApiUpdate={onUpdate}
      onApiDelete={onDelete}
      onApiGetDetail={async (id) => {
        const d = await fetchListeningTestById(id)
        return { setId: d.setId, testId: d.testId }
      }}
      onFilterChange={onFilterChange}
    />
  )
}
