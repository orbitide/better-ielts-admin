import { revalidatePath } from 'next/cache'
import { getIeltsSets } from '@/lib/data/ielts'
import { createIeltsSet, fetchIeltsSetById, updateIeltsSet, deleteIeltsSet } from '@/lib/api/ielts'
import { IeltsContentShell } from '@/components/ielts/IeltsContentShell'
import type { ContentRow } from '@/components/ielts/ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'

export const metadata = { title: 'Sets' }

export default async function SetsPage() {
  const sets = await getIeltsSets()
  const rows: ContentRow[] = sets.map((s) => ({
    id: s.id,
    title: s.title,
    meta: '',
    type: s.type,
    testCount: `${s.testCount} test${s.testCount !== 1 ? 's' : ''}`,
    difficulty: s.difficulty,
    status: s.status,
    createdAt: s.createdAt,
  }))

  async function onCreate(data: { title: string; type: string }) {
    'use server'
    const set = await createIeltsSet({ title: data.title, type: data.type })
    revalidatePath('/ielts/mock-tests')
    return { id: set.id, createdAt: set.createdAt }
  }

  async function onUpdate(id: string, data: { title: string; type: string; status: IeltsStatus }) {
    'use server'
    const current = await fetchIeltsSetById(id)
    await updateIeltsSet(id, { ...current, title: data.title, type: data.type as 'academic' | 'general', status: data.status })
    revalidatePath('/ielts/mock-tests')
  }

  async function onDelete(id: string) {
    'use server'
    await deleteIeltsSet(id)
    revalidatePath('/ielts/mock-tests')
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
