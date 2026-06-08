'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { SpeakingPart } from '@/lib/types/ielts'
import { SpeakingPartSchema } from '@/lib/validations/ielts'
import { fieldErrors } from '@/lib/validations/utils'

type SpeakingPartFormData = {
  topic: string
  speakingMinutes: number
  cueCardPrompt?: string
  preparationSeconds?: number
}

type SpeakingPartFormModalProps = {
  open: boolean
  onClose: () => void
  part: SpeakingPart
  onSave: (data: SpeakingPartFormData) => void
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

export function SpeakingPartFormModal({ open, onClose, part, onSave }: SpeakingPartFormModalProps) {
  const [topic, setTopic] = useState('')
  const [speakingMinutes, setSpeakingMinutes] = useState(4)
  const [cueCardPrompt, setCueCardPrompt] = useState('')
  const [preparationSeconds, setPreparationSeconds] = useState(60)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setTopic(part.topic)
    setSpeakingMinutes(part.speakingMinutes)
    setCueCardPrompt(part.cueCardPrompt ?? '')
    setPreparationSeconds(part.preparationSeconds ?? 60)
    setErrors({})
  }, [part, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: SpeakingPartFormData = { topic, speakingMinutes }
    if (part.part === 2) {
      payload.cueCardPrompt = cueCardPrompt
      payload.preparationSeconds = preparationSeconds
    }

    const result = SpeakingPartSchema.safeParse(payload)
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    onSave(payload)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Edit Part ${part.part}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Topic</label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Personal Background & Hometown" />
          {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Speaking Time (minutes)</label>
          <Input type="number" min={1} max={15} value={speakingMinutes} onChange={(e) => setSpeakingMinutes(Number(e.target.value))} />
          {errors.speakingMinutes && <p className="text-xs text-destructive mt-1">{errors.speakingMinutes}</p>}
        </div>

        {part.part === 2 && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Preparation Time (seconds)</label>
              <Input type="number" min={30} max={120} value={preparationSeconds} onChange={(e) => setPreparationSeconds(Number(e.target.value))} />
              {errors.preparationSeconds && <p className="text-xs text-destructive mt-1">{errors.preparationSeconds}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cue Card Prompt</label>
              <textarea
                value={cueCardPrompt}
                onChange={(e) => setCueCardPrompt(e.target.value)}
                rows={4}
                className={textareaClass}
                placeholder="Describe a …&#10;&#10;You should say:&#10;  • …"
              />
            </div>
          </>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}
