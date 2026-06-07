'use client'

import { useState } from 'react'
import { X, Plus, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SpeakingPartFormModal } from './SpeakingPartFormModal'
import type { SpeakingPart } from '@/lib/types/ielts'

type SpeakingPartCardProps = {
  part: SpeakingPart
  onUpdate: (updated: SpeakingPart) => void
}

export function SpeakingPartCard({ part: initial, onUpdate }: SpeakingPartCardProps) {
  const [part, setPart] = useState(initial)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')

  const handlePartSave = (data: { topic: string; speakingMinutes: number; cueCardPrompt?: string; preparationSeconds?: number }) => {
    const updated = { ...part, ...data }
    setPart(updated)
    onUpdate(updated)
  }

  const handleAddQuestion = () => {
    const trimmed = newQuestion.trim()
    if (!trimmed) return
    const updated = { ...part, questions: [...part.questions, trimmed] }
    setPart(updated)
    onUpdate(updated)
    setNewQuestion('')
  }

  const handleDeleteQuestion = (idx: number) => {
    const updated = { ...part, questions: part.questions.filter((_, i) => i !== idx) }
    setPart(updated)
    onUpdate(updated)
  }

  const partColors = ['bg-blue-50 border-blue-200 dark:bg-blue-950/20', 'bg-amber-50 border-amber-200 dark:bg-amber-950/20', 'bg-green-50 border-green-200 dark:bg-green-950/20']
  const partColor = partColors[(part.part - 1) % 3]

  return (
    <>
      <div className={`rounded-xl border p-4 space-y-3 ${partColor}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Part {part.part}</Badge>
              <span className="font-medium text-sm">{part.topic}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {part.speakingMinutes} min speaking
              {part.preparationSeconds && ` · ${part.preparationSeconds}s prep`}
            </p>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            title="Edit part"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {part.part === 2 && part.cueCardPrompt && (
          <div className="rounded-lg bg-background/60 border border-border p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cue Card</p>
            <p className="text-sm whitespace-pre-line leading-relaxed">{part.cueCardPrompt}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Questions ({part.questions.length})
          </p>
          <ul className="space-y-1">
            {part.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 group">
                <span className="text-xs text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
                <span className="text-sm flex-1 leading-snug">{q}</span>
                <button
                  onClick={() => handleDeleteQuestion(i)}
                  className="text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

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
        </div>
      </div>

      <SpeakingPartFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        part={part}
        onSave={handlePartSave}
      />
    </>
  )
}
