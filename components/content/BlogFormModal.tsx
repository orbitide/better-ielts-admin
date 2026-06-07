'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { BlogPost } from '@/lib/types/content'

const CATEGORIES = ['Study Tips', 'Writing', 'Reading', 'Listening', 'Speaking', 'Vocabulary', 'General']

type BlogFormModalProps = {
  open: boolean
  onClose: () => void
  editing: BlogPost | null
  onSave: (data: Partial<BlogPost>) => void
}

export function BlogFormModal({ open, onClose, editing, onSave }: BlogFormModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')
  const [excerpt, setExcerpt] = useState('')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setCategory(editing.category)
      setAuthor(editing.author)
      setStatus(editing.status)
      setExcerpt(editing.excerpt)
    } else {
      setTitle('')
      setCategory(CATEGORIES[0])
      setAuthor('')
      setStatus('draft')
      setExcerpt('')
    }
  }, [editing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, category, author, status, excerpt })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Post' : 'New Blog Post'} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title…" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Author</label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name…" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description…"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Create Post'}</Button>
        </div>
      </form>
    </Modal>
  )
}
