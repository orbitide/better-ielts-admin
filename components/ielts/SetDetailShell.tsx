'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { MockTestFormModal } from './MockTestFormModal'
import type { FullIeltsSet, FullIeltsTest, IeltsStatus } from '@/lib/types/ielts'
import { updateIeltsSet, addTestToSet } from '@/lib/api/ielts'

const difficultyVariant: Record<'beginner' | 'intermediate' | 'advanced', 'success' | 'warning' | 'secondary'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'secondary',
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type SetDetailShellProps = {
  set: FullIeltsSet
}

export function SetDetailShell({ set: initial }: SetDetailShellProps) {
  const [set, setSet] = useState(initial)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addTestModalOpen, setAddTestModalOpen] = useState(false)
  const [newTestTitle, setNewTestTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const sorted = [...set.tests].sort((a, b) => a.orderIndex - b.orderIndex)

  const handleEditSave = async (data: { title: string; description: string; type: 'academic' | 'general'; difficulty: 'beginner' | 'intermediate' | 'advanced'; status: IeltsStatus }) => {
    const prev = set
    const updated = { ...set, ...data }
    setSet(updated)
    try { await updateIeltsSet(set.id, updated) } catch { setSet(prev) }
  }

  const handleAddTest = async () => {
    if (!newTestTitle.trim()) return
    setSaving(true)
    try {
      const test = await addTestToSet(set.id, { title: newTestTitle.trim(), orderIndex: set.tests.length + 1, durationMinutes: 170, sections: [] })
      setSet((prev) => ({ ...prev, tests: [...prev.tests, test], testCount: prev.tests.length + 1 }))
      setNewTestTitle('')
      setAddTestModalOpen(false)
    } catch { /* leave state */ }
    setSaving(false)
  }

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Sets', href: '/ielts/mock-tests' }, { label: set.title }]} />

      <div className="space-y-4">
        <PageHeader title={set.title} description={set.description || 'No description.'}>
          <Button size="sm" variant="ghost" onClick={() => setEditModalOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button size="sm" onClick={() => setAddTestModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Test
          </Button>
        </PageHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[set.status]}>{set.status}</Badge>
          <Badge variant="secondary">{set.type}</Badge>
          <Badge variant={difficultyVariant[set.difficulty]}>{set.difficulty}</Badge>
          <span className="text-xs text-muted-foreground">{set.testCount} test{set.testCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tests in this Set</h2>

        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            No tests yet. Click &ldquo;Add Test&rdquo; to get started.
          </p>
        ) : (
          sorted.map((test) => (
            <TestRow key={test.id} setId={set.id} test={test} />
          ))
        )}
      </div>

      <MockTestFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editing={set}
        onSave={handleEditSave}
      />

      <Modal open={addTestModalOpen} onClose={() => setAddTestModalOpen(false)} title="Add Test">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Test Title</label>
            <Input value={newTestTitle} onChange={(e) => setNewTestTitle(e.target.value)} placeholder="e.g. Test 1" autoFocus />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setAddTestModalOpen(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={handleAddTest} disabled={saving || !newTestTitle.trim()}>
              {saving ? 'Adding…' : 'Add Test'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function TestRow({ setId, test }: { setId: string; test: FullIeltsTest }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
      <div className="rounded-lg bg-muted flex items-center justify-center h-9 w-9 text-sm font-semibold shrink-0">
        {test.orderIndex}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-medium text-sm">{test.title}</p>
        <p className="text-xs text-muted-foreground">
          {test.durationMinutes} min &middot; {test.sectionCount} skills
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={test.status === 'published' ? 'success' : test.status === 'draft' ? 'warning' : 'secondary'}>
          {test.status}
        </Badge>
        <Link
          href={`/ielts/mock-tests/${setId}/tests/${test.id}`}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Manage test"
        >
          <Settings2 className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
