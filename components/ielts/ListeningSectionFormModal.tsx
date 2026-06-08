'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ListeningSection } from '@/lib/types/ielts'
import { ListeningSectionSchema } from '@/lib/validations/ielts'
import { fieldErrors } from '@/lib/validations/utils'

type ListeningSectionFormData = {
  sectionNumber: 1 | 2 | 3 | 4
  audioUrl: string
  audioDurationSeconds: number
  transcript: string
}

type ListeningSectionFormModalProps = {
  open: boolean
  onClose: () => void
  editing: ListeningSection | null
  onSave: (data: ListeningSectionFormData) => void
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none'

export function ListeningSectionFormModal({ open, onClose, editing, onSave }: ListeningSectionFormModalProps) {
  const [sectionNumber, setSectionNumber] = useState<1 | 2 | 3 | 4>(1)
  const [audioUrl, setAudioUrl] = useState('')
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(300)
  const [transcript, setTranscript] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editing) {
      setSectionNumber(editing.sectionNumber)
      setAudioUrl(editing.audioUrl)
      setAudioDurationSeconds(editing.audioDurationSeconds)
      setTranscript(editing.transcript)
    } else {
      setSectionNumber(1)
      setAudioUrl('')
      setAudioDurationSeconds(300)
      setTranscript('')
    }
    setErrors({})
  }, [editing, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = ListeningSectionSchema.safeParse({ sectionNumber, audioUrl, audioDurationSeconds, transcript })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    onSave({ sectionNumber, audioUrl, audioDurationSeconds, transcript })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Section' : 'New Section'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Section Number</label>
            <Select value={sectionNumber} onChange={(e) => setSectionNumber(Number(e.target.value) as 1 | 2 | 3 | 4)} className="w-full">
              <option value={1}>Section 1</option>
              <option value={2}>Section 2</option>
              <option value={3}>Section 3</option>
              <option value={4}>Section 4</option>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Audio URL</label>
            <Input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="/audio/lt-1-section-1.mp3" />
            {errors.audioUrl && <p className="text-xs text-destructive mt-1">{errors.audioUrl}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Audio Duration (seconds)</label>
          <Input
            type="number"
            min={0}
            value={audioDurationSeconds}
            onChange={(e) => setAudioDurationSeconds(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Transcript</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the full audio transcript here…"
            rows={8}
            className={textareaClass}
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
