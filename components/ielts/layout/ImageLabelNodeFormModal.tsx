'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImagePickerField } from '@/components/media/ImagePickerField'
import type { FullListeningTest, ImageLabelNode, ImageLabelPoint } from '@/lib/types/ielts'
import { genLayoutNodeId, getNextQuestionNumber, inputIdFor } from '@/lib/utils/listening-layout'
import { validateImageLabelNode } from '@/lib/validations/listening-layout'

type Props = {
  open: boolean
  onClose: () => void
  editing: ImageLabelNode | null
  test: FullListeningTest
  onSave: (node: ImageLabelNode) => void
}

export function ImageLabelNodeFormModal({ open, onClose, editing, test, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [points, setPoints] = useState<ImageLabelPoint[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setTitle(editing.title ?? '')
      setImageUrl(editing.imageUrl)
      setPoints(editing.points.map((p) => ({ ...p })))
    } else {
      setTitle('')
      setImageUrl('')
      setPoints([])
    }
    setErrors({})
  }, [editing, open])

  const nextQuestionNumber = () => {
    const testMax = getNextQuestionNumber(test, editing?.id) - 1
    const draftMax = points.reduce((max, p) => Math.max(max, p.questionNumber), 0)
    return Math.max(testMax, draftMax) + 1
  }

  const addPoint = () => {
    const questionNumber = nextQuestionNumber()
    setPoints((prev) => [
      ...prev,
      { label: '', inputId: inputIdFor(questionNumber), questionNumber, correctAnswer: '', x: 50, y: 50 },
    ])
  }

  const removePoint = (index: number) => {
    setPoints((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePoint = (index: number, patch: Partial<ImageLabelPoint>) => {
    setPoints((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const node: ImageLabelNode = {
      type: 'image_label',
      id: editing?.id ?? genLayoutNodeId('img'),
      title: title.trim() || undefined,
      imageUrl,
      points,
    }
    const validationErrors = validateImageLabelNode(node)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(node)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Image Label' : 'Add Image Label'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title (optional)</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Plan of the Library" />
        </div>

        <ImagePickerField label="Diagram Image" value={imageUrl || undefined} onChange={(url) => setImageUrl(url ?? '')} folder="inline" />
        {errors.imageUrl && <p className="text-xs text-destructive -mt-2">{errors.imageUrl}</p>}

        {imageUrl && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Marker Preview</label>
            <div className="relative rounded-md border border-border overflow-hidden">
              <img src={imageUrl} alt="Diagram preview" className="block w-full h-auto" />
              {points.map((p) => (
                <div
                  key={p.inputId}
                  className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  title={p.label || `Q${p.questionNumber}`}
                >
                  {p.questionNumber}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Label Points</label>
            <button type="button" onClick={addPoint} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus className="h-3 w-3" /> Add point
            </button>
          </div>

          {points.length === 0 && (
            <p className="text-xs text-muted-foreground">No label points yet — add one above.</p>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {points.map((p, i) => (
              <div key={p.inputId} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Q{p.questionNumber}</span>
                  <button type="button" onClick={() => removePoint(i)} className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Input value={p.label} onChange={(e) => updatePoint(i, { label: e.target.value })} placeholder="Label (e.g. Reception)" />
                <Input value={p.correctAnswer} onChange={(e) => updatePoint(i, { correctAnswer: e.target.value })} placeholder="Correct answer…" />

                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">X %</label>
                    <Input type="number" min={0} max={100} value={p.x} onChange={(e) => updatePoint(i, { x: Number(e.target.value) })} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Y %</label>
                    <Input type="number" min={0} max={100} value={p.y} onChange={(e) => updatePoint(i, { y: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.points && <p className="text-xs text-destructive mt-1">{errors.points}</p>}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Image Label'}</Button>
        </div>
      </form>
    </Modal>
  )
}
