'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import type { ContentRow } from './ContentTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import { ContentSchema } from '@/lib/validations/ielts'
import { fieldErrors } from '@/lib/validations/utils'

export type SetOption = {
  id: string
  title: string
  tests: { id: string; title: string }[]
}

type ContentFormModalProps = {
  open: boolean
  onClose: () => void
  editing: ContentRow | null
  typeOptions?: string[]
  typeLabel?: string
  setOptions?: SetOption[]
  onSave: (data: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) => void
}

export function ContentFormModal({
  open,
  onClose,
  editing,
  typeOptions = ['academic', 'general'],
  typeLabel = 'Type',
  setOptions,
  onSave,
}: ContentFormModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(typeOptions[0])
  const [status, setStatus] = useState<IeltsStatus>('draft')
  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedSet = setOptions?.find((s) => s.id === selectedSetId)

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setStatus(editing.status)
    } else {
      setTitle('')
      setType(typeOptions[0])
      setStatus('draft')
      setSelectedSetId('')
      setSelectedTestId('')
    }
    setErrors({})
  }, [editing, typeOptions])

  const handleSetChange = (value: string) => {
    setSelectedSetId(value)
    setSelectedTestId('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = ContentSchema.safeParse({ title, type, status })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    onSave({
      title,
      type,
      status,
      setId: selectedSetId || undefined,
      testId: selectedTestId || undefined,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Item' : 'New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title…" />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
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
          {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as IeltsStatus)} className="w-full">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        {!editing && setOptions && setOptions.length > 0 && (
          <div className="space-y-3 pt-1 border-t border-border">
            <p className="text-xs text-muted-foreground pt-1">Assign to a mock test (optional)</p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Set</label>
              <SearchableSelect
                value={selectedSetId}
                onChange={handleSetChange}
                options={setOptions.map((s) => ({ value: s.id, label: s.title }))}
                placeholder="— Select set —"
                className="w-full"
              />
            </div>
            {selectedSet && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Test</label>
                <SearchableSelect
                  value={selectedTestId}
                  onChange={setSelectedTestId}
                  options={selectedSet.tests.map((t) => ({ value: t.id, label: t.title }))}
                  placeholder="— Select test —"
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
