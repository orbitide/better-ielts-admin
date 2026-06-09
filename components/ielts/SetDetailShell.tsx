'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Pencil, Plus, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { MockTestFormModal } from './MockTestFormModal'
import type { FullIeltsSet, FullIeltsTest, IeltsStatus } from '@/lib/types/ielts'
import { updateIeltsSet, addTestToSet, updateTestInSet } from '@/lib/api/ielts'

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
  const [editingTest, setEditingTest] = useState<FullIeltsTest | null>(null)
  const [editTestTitle, setEditTestTitle] = useState('')
  const [editTestStatus, setEditTestStatus] = useState<IeltsStatus>('draft')
  const [editTestDuration, setEditTestDuration] = useState('')
  const [editTestSaving, setEditTestSaving] = useState(false)

  const openEditTest = (test: FullIeltsTest) => {
    setEditingTest(test)
    setEditTestTitle(test.title)
    setEditTestStatus(test.status)
    setEditTestDuration(String(test.durationMinutes))
  }

  const handleEditTestSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTest) return
    const duration = parseInt(editTestDuration, 10)
    if (!editTestTitle.trim() || isNaN(duration) || duration < 1) return
    setEditTestSaving(true)
    const updated: FullIeltsTest = { ...editingTest, title: editTestTitle.trim(), status: editTestStatus, durationMinutes: duration }
    try {
      await updateTestInSet(editingTest.id, set.id, updated)
      setSet((prev) => ({ ...prev, tests: prev.tests.map((t) => t.id === editingTest.id ? updated : t) }))
      setEditingTest(null)
      toast.success('Test updated.')
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to update test.')
    }
    setEditTestSaving(false)
  }

  const sorted = [...set.tests].sort((a, b) => a.orderIndex - b.orderIndex)

  const handleEditSave = async (data: { title: string; description: string; type: 'academic' | 'general'; difficulty: 'beginner' | 'intermediate' | 'advanced'; status: IeltsStatus }) => {
    const prev = set
    const updated = { ...set, ...data }
    setSet(updated)
    try {
      await updateIeltsSet(set.id, updated)
      toast.success('Set updated.')
    } catch (err) {
      setSet(prev)
      toast.error((err as Error).message ?? 'Failed to update set.')
    }
  }

  const handleAddTest = async () => {
    if (!newTestTitle.trim()) return
    setSaving(true)
    try {
      const test = await addTestToSet(set.id, { title: newTestTitle.trim(), orderIndex: set.tests.length + 1, durationMinutes: 170, sections: [] })
      setSet((prev) => ({ ...prev, tests: [...prev.tests, test], testCount: prev.tests.length + 1 }))
      setNewTestTitle('')
      setAddTestModalOpen(false)
      toast.success('Test added.')
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to add test.')
    }
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
            <TestRow key={test.id} setId={set.id} test={test} onEdit={openEditTest} />
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

      <Modal open={!!editingTest} onClose={() => setEditingTest(null)} title="Edit Test">
        <form onSubmit={handleEditTestSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={editTestTitle} onChange={(e) => setEditTestTitle(e.target.value)} placeholder="e.g. Test 1" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={editTestStatus} onChange={(e) => setEditTestStatus(e.target.value as IeltsStatus)} className="w-full">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Duration (min)</label>
              <Input type="number" min={1} value={editTestDuration} onChange={(e) => setEditTestDuration(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingTest(null)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={editTestSaving || !editTestTitle.trim()}>
              {editTestSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function TestRow({ setId, test, onEdit }: { setId: string; test: FullIeltsTest; onEdit: (test: FullIeltsTest) => void }) {
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
        <button
          onClick={() => onEdit(test)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Edit test"
        >
          <Pencil className="h-4 w-4" />
        </button>
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
