'use client'

import { useState } from 'react'
import { Pencil, Plus, X, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from '@/components/ielts/Breadcrumb'
import { RoleGate } from '@/components/auth/RoleGate'
import { updateCallTopic } from '@/lib/api/calls'
import { CALL_TOPIC_ICON_OPTIONS, type CallTopic } from '@/lib/types/calls'
import type { IeltsStatus } from '@/lib/types/ielts'

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type CallTopicDetailShellProps = {
  topic: CallTopic
}

export function CallTopicDetailShell({ topic: initial }: CallTopicDetailShellProps) {
  const [topic, setTopic] = useState(initial)
  const [editMetaOpen, setEditMetaOpen] = useState(false)
  const [draftLabel, setDraftLabel] = useState(initial.label)
  const [draftIcon, setDraftIcon] = useState(initial.icon)
  const [draftDescription, setDraftDescription] = useState(initial.description)
  const [draftStatus, setDraftStatus] = useState<IeltsStatus>(initial.status)
  const [newQuestion, setNewQuestion] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const persist = async (updated: CallTopic) => {
    const prev = topic
    setTopic(updated)
    try {
      const saved = await updateCallTopic(updated.id, updated)
      setTopic(saved)
    } catch {
      setTopic(prev)
    }
  }

  const openEditMeta = () => {
    setDraftLabel(topic.label)
    setDraftIcon(topic.icon)
    setDraftDescription(topic.description)
    setDraftStatus(topic.status)
    setEditMetaOpen(true)
  }

  const handleMetaSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditMetaOpen(false)
    await persist({ ...topic, label: draftLabel, icon: draftIcon, description: draftDescription, status: draftStatus })
  }

  const handleAddQuestion = async () => {
    const trimmed = newQuestion.trim()
    if (!trimmed) return
    await persist({ ...topic, questions: [...topic.questions, trimmed] })
    setNewQuestion('')
  }

  const handleDeleteQuestion = async () => {
    if (deleteTarget === null) return
    const updatedQuestions = topic.questions.filter((_, i) => i !== deleteTarget)
    setDeleteTarget(null)
    await persist({ ...topic, questions: updatedQuestions })
  }

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[
          { label: 'Call Topics', href: '/calls/topics' },
          { label: topic.label },
        ]} />

        <div className="space-y-4">
          <PageHeader title={topic.label} description={topic.description || 'No description.'}>
            <Button size="sm" variant="ghost" onClick={openEditMeta}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </PageHeader>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[topic.status]}>{topic.status}</Badge>
            <Badge variant="secondary">{topic.icon}</Badge>
            <span className="text-xs text-muted-foreground">
              {topic.questions.length} question{topic.questions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Questions ({topic.questions.length})
          </h2>

          {topic.questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No questions yet.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {topic.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 group rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-sm flex-1 leading-snug">{q}</span>
                  <RoleGate permission="ielts:delete">
                    <button
                      onClick={() => setDeleteTarget(i)}
                      className="text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </RoleGate>
                </li>
              ))}
            </ul>
          )}

          <RoleGate permission="ielts:edit">
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuestion() } }}
                placeholder="Type a question and press Enter…"
                className="text-sm"
              />
              <Button type="button" size="sm" variant="ghost" onClick={handleAddQuestion}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </RoleGate>
        </div>
      </div>

      <Modal open={editMetaOpen} onClose={() => setEditMetaOpen(false)} title="Edit Topic">
        <form onSubmit={handleMetaSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Label</label>
            <Input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} placeholder="Topic label" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icon</label>
            <Select value={draftIcon} onChange={(e) => setDraftIcon(e.target.value)} className="w-full">
              {CALL_TOPIC_ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              rows={3}
              className={textareaClass}
              placeholder="Short description shown on the topic selection screen…"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <Select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as IeltsStatus)} className="w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditMetaOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Question">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteQuestion}>Delete</Button>
        </div>
      </Modal>
    </>
  )
}
