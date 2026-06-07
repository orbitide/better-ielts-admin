'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ReadingSection, ReadingPassage } from '@/lib/types/ielts'

type ReadingSectionFormData = {
  passageTitle: string
  passageBody: string
  passageIndex: number
}

type ReadingSectionFormModalProps = {
  open: boolean
  onClose: () => void
  editing: ReadingSection | null
  nextPassageIndex: number
  onSave: (data: ReadingSectionFormData) => void
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none'

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function ReadingSectionFormModal({ open, onClose, editing, nextPassageIndex, onSave }: ReadingSectionFormModalProps) {
  const [passageTitle, setPassageTitle] = useState('')
  const [passageBody, setPassageBody] = useState('')
  const [passageIndex, setPassageIndex] = useState(0)

  useEffect(() => {
    if (editing) {
      setPassageTitle(editing.passage.title)
      setPassageBody(editing.passage.body)
      setPassageIndex(editing.passageIndex)
    } else {
      setPassageTitle('')
      setPassageBody('')
      setPassageIndex(nextPassageIndex)
    }
  }, [editing, nextPassageIndex, open])

  const wordCount = countWords(passageBody)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ passageTitle, passageBody, passageIndex })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Section' : 'New Section'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Passage Title</label>
            <Input
              value={passageTitle}
              onChange={(e) => setPassageTitle(e.target.value)}
              placeholder="e.g. The History of Urban Planning"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Passage Index</label>
            <Input
              type="number"
              value={passageIndex}
              min={0}
              onChange={(e) => setPassageIndex(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Passage Body</label>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <textarea
            value={passageBody}
            onChange={(e) => setPassageBody(e.target.value)}
            placeholder="Paste or type the reading passage here…"
            rows={12}
            className={textareaClass}
            required
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Section'}</Button>
        </div>
      </form>
    </Modal>
  )
}
