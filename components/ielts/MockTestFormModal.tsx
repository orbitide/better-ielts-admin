'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { IeltsStatus } from '@/lib/types/ielts'
import { MockTestSchema } from '@/lib/validations/ielts'
import { fieldErrors } from '@/lib/validations/utils'

type MockTestFormData = {
  title: string
  description: string
  type: 'academic' | 'general'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: IeltsStatus
}

type MockTestFormModalProps = {
  open: boolean
  onClose: () => void
  editing: Partial<MockTestFormData> | null
  onSave: (data: MockTestFormData) => void
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none'

export function MockTestFormModal({ open, onClose, editing, onSave }: MockTestFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'academic' | 'general'>('academic')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [status, setStatus] = useState<IeltsStatus>('draft')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editing) {
      setTitle(editing.title ?? '')
      setDescription(editing.description ?? '')
      setType(editing.type ?? 'academic')
      setDifficulty(editing.difficulty ?? 'intermediate')
      setStatus(editing.status ?? 'draft')
    } else {
      setTitle('')
      setDescription('')
      setType('academic')
      setDifficulty('intermediate')
      setStatus('draft')
    }
    setErrors({})
  }, [editing, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = MockTestSchema.safeParse({ title, description, type, difficulty, status })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    onSave({ title, description, type, difficulty, status })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Set' : 'New Set'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Mock Test 1 — Academic" />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this test set…"
            rows={3}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Exam Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as 'academic' | 'general')} className="w-full">
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')} className="w-full">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as IeltsStatus)} className="w-full">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
