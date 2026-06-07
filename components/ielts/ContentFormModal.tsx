'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ContentRow } from './ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'

type ContentFormModalProps = {
  open: boolean
  onClose: () => void
  editing: ContentRow | null
  typeOptions?: string[]
  typeLabel?: string
  onSave: (data: { title: string; type: string; status: IeltsStatus }) => void
}

export function ContentFormModal({
  open,
  onClose,
  editing,
  typeOptions = ['academic', 'general'],
  typeLabel = 'Type',
  onSave,
}: ContentFormModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(typeOptions[0])
  const [status, setStatus] = useState<IeltsStatus>('draft')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setStatus(editing.status)
    } else {
      setTitle('')
      setType(typeOptions[0])
      setStatus('draft')
    }
  }, [editing, typeOptions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, type, status })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Item' : 'New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title…"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{typeLabel}</label>
          <Select value={type} onChange={(e) => setType(e.target.value)} className="w-full">
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </Select>
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
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {editing ? 'Save Changes' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
