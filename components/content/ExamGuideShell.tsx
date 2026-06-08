'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import type { ExamGuideSection } from '@/lib/types/content'
import { RoleGate } from '@/components/auth/RoleGate'

export function ExamGuideShell({ initialSections }: { initialSections: ExamGuideSection[] }) {
  const [sections, setSections] = useState(initialSections)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ExamGuideSection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExamGuideSection | null>(null)
  const [title, setTitle] = useState('')
  const [skill, setSkill] = useState<ExamGuideSection['skill']>('general')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')

  const openNew = () => {
    setEditing(null)
    setTitle('')
    setSkill('general')
    setStatus('draft')
    setModalOpen(true)
  }

  const openEdit = (s: ExamGuideSection) => {
    setEditing(s)
    setTitle(s.title)
    setSkill(s.skill)
    setStatus(s.status)
    setModalOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setSections((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      setSections((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, title, skill, status, updatedAt: new Date().toISOString().slice(0, 10) } : s))
      )
    } else {
      setSections((prev) => [
        {
          id: `eg-${Date.now()}`,
          title,
          skill,
          order: prev.length + 1,
          status,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
    }
    setModalOpen(false)
  }

  return (
    <>
      <div className="space-y-5">
        <PageHeader title="Exam Guide" description="Manage the IELTS exam guide sections shown to students.">
          <RoleGate permission="content:edit">
            <Button onClick={openNew} size="sm"><Plus className="h-3.5 w-3.5" />New Section</Button>
          </RoleGate>
        </PageHeader>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Skill</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Updated</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sections.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="secondary">{s.skill}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === 'published' ? 'success' : 'warning'}>{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <RoleGate permission="content:edit">
                        <button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                      <RoleGate permission="content:delete">
                        <button onClick={() => setDeleteTarget(s)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Section">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Section' : 'New Section'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section title…" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Skill</label>
              <Select value={skill} onChange={(e) => setSkill(e.target.value as ExamGuideSection['skill'])} className="w-full">
                {['general', 'listening', 'reading', 'writing', 'speaking'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value as 'published' | 'draft')} className="w-full">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
