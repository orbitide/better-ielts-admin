'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { FullListeningTest, McqGroupNode, McqGroupQuestion, McqOption } from '@/lib/types/ielts'
import { genLayoutNodeId, getNextQuestionNumber, inputIdFor } from '@/lib/utils/listening-layout'
import { validateMcqGroupNode } from '@/lib/validations/listening-layout'

type Props = {
  open: boolean
  onClose: () => void
  editing: McqGroupNode | null
  test: FullListeningTest
  onSave: (node: McqGroupNode) => void
}

const defaultMcqOptions: McqOption[] = [
  { label: 'A', text: '' },
  { label: 'B', text: '' },
  { label: 'C', text: '' },
  { label: 'D', text: '' },
]

export function McqGroupNodeFormModal({ open, onClose, editing, test, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [questions, setQuestions] = useState<McqGroupQuestion[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setTitle(editing.title ?? '')
      setInstructions(editing.instructions ?? '')
      setQuestions(editing.questions.map((q) => ({ ...q, options: q.options.map((o) => ({ ...o })) })))
    } else {
      setTitle('')
      setInstructions('')
      setQuestions([])
    }
    setErrors({})
  }, [editing, open])

  const nextQuestionNumber = () => {
    const testMax = getNextQuestionNumber(test, editing?.id) - 1
    const draftMax = questions.reduce((max, q) => Math.max(max, q.questionNumber), 0)
    return Math.max(testMax, draftMax) + 1
  }

  const addQuestion = () => {
    const questionNumber = nextQuestionNumber()
    setQuestions((prev) => [
      ...prev,
      {
        id: genLayoutNodeId('mcgq'),
        inputId: inputIdFor(questionNumber),
        questionNumber,
        text: '',
        options: defaultMcqOptions.map((o) => ({ ...o })),
        correctAnswer: 'A',
      },
    ])
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, patch: Partial<McqGroupQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  const updateOption = (id: string, optIndex: number, text: string) => {
    setQuestions((prev) => prev.map((q) =>
      q.id === id ? { ...q, options: q.options.map((o, i) => (i === optIndex ? { ...o, text } : o)) } : q
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const node: McqGroupNode = {
      type: 'mcq_group',
      id: editing?.id ?? genLayoutNodeId('mcqg'),
      title: title.trim() || undefined,
      instructions: instructions.trim() || undefined,
      questions,
    }
    const validationErrors = validateMcqGroupNode(node)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(node)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit MCQ Group' : 'Add MCQ Group'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title (optional)</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Questions 9-10" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Instructions (optional)</label>
          <Input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Choose the correct letter, A, B or C." />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sub-questions</label>
            <button type="button" onClick={addQuestion} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus className="h-3 w-3" /> Add question
            </button>
          </div>

          {questions.length === 0 && (
            <p className="text-xs text-muted-foreground">No sub-questions yet — add one above.</p>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {questions.map((q) => (
              <div key={q.id} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Q{q.questionNumber}</span>
                  <button type="button" onClick={() => removeQuestion(q.id)} className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Input value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} placeholder="Question text…" />

                <div className="space-y-1.5">
                  {q.options.map((opt, i) => (
                    <div key={opt.label} className="flex items-center gap-2">
                      <span className="w-5 text-xs font-mono text-muted-foreground shrink-0">{opt.label}</span>
                      <Input value={opt.text} onChange={(e) => updateOption(q.id, i, e.target.value)} placeholder={`Option ${opt.label}…`} />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Correct Answer</label>
                  <Select value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })} className="w-full">
                    {q.options.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </Select>
                </div>
              </div>
            ))}
          </div>
          {errors.questions && <p className="text-xs text-destructive mt-1">{errors.questions}</p>}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add MCQ Group'}</Button>
        </div>
      </form>
    </Modal>
  )
}
