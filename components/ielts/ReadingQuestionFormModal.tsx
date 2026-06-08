'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ReadingQuestion, McqQuestion, TfngQuestion, MatchingQuestion, FillBlankQuestion, McqOption, MatchingOption } from '@/lib/types/ielts'
import { ReadingQuestionSchema } from '@/lib/validations/ielts'
import { fieldErrors } from '@/lib/validations/utils'

type Props = {
  open: boolean
  onClose: () => void
  editing: ReadingQuestion | null
  nextQuestionNumber: number
  onSave: (q: ReadingQuestion) => void
}

type QuestionType = 'mcq' | 'tfng' | 'matching' | 'fill-blank'

function genId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const defaultMcqOptions: McqOption[] = [
  { label: 'A', text: '' },
  { label: 'B', text: '' },
  { label: 'C', text: '' },
  { label: 'D', text: '' },
]

export function ReadingQuestionFormModal({ open, onClose, editing, nextQuestionNumber, onSave }: Props) {
  const [qType, setQType] = useState<QuestionType>('mcq')
  const [qNumber, setQNumber] = useState(nextQuestionNumber)

  const [mcqStem, setMcqStem] = useState('')
  const [mcqOptions, setMcqOptions] = useState<McqOption[]>(defaultMcqOptions)
  const [mcqAnswer, setMcqAnswer] = useState('A')

  const [tfngStatement, setTfngStatement] = useState('')
  const [tfngAnswer, setTfngAnswer] = useState<'TRUE' | 'FALSE' | 'NOT GIVEN'>('TRUE')

  const [matchStem, setMatchStem] = useState('')
  const [matchOptions, setMatchOptions] = useState<MatchingOption[]>([{ key: 'i', text: '' }])
  const [matchAnswer, setMatchAnswer] = useState('')

  const [fbStem, setFbStem] = useState('')
  const [fbAnswer, setFbAnswer] = useState('')
  const [fbWordLimit, setFbWordLimit] = useState<number | ''>('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setQType(editing.type)
      setQNumber(editing.questionNumber)
      if (editing.type === 'mcq') {
        setMcqStem(editing.stem)
        setMcqOptions(editing.options.length ? editing.options : defaultMcqOptions)
        setMcqAnswer(editing.correctAnswer)
      } else if (editing.type === 'tfng') {
        setTfngStatement(editing.statement)
        setTfngAnswer(editing.correctAnswer)
      } else if (editing.type === 'matching') {
        setMatchStem(editing.stem)
        setMatchOptions(editing.options.length ? editing.options : [{ key: 'i', text: '' }])
        setMatchAnswer(editing.correctAnswer)
      } else if (editing.type === 'fill-blank') {
        setFbStem(editing.stem)
        setFbAnswer(editing.correctAnswer)
        setFbWordLimit(editing.wordLimit ?? '')
      }
    } else {
      setQType('mcq')
      setQNumber(nextQuestionNumber)
      setMcqStem('')
      setMcqOptions(defaultMcqOptions)
      setMcqAnswer('A')
      setTfngStatement('')
      setTfngAnswer('TRUE')
      setMatchStem('')
      setMatchOptions([{ key: 'i', text: '' }])
      setMatchAnswer('')
      setFbStem('')
      setFbAnswer('')
      setFbWordLimit('')
    }
    setErrors({})
  }, [editing, nextQuestionNumber, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload =
      qType === 'mcq'        ? { qType, qNumber, mcqStem, mcqOptions, mcqAnswer } :
      qType === 'tfng'       ? { qType, qNumber, tfngStatement, tfngAnswer } :
      qType === 'matching'   ? { qType, qNumber, matchStem, matchOptions, matchAnswer } :
                               { qType, qNumber, fbStem, fbAnswer, fbWordLimit: fbWordLimit === '' ? undefined : fbWordLimit }

    const result = ReadingQuestionSchema.safeParse(payload)
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    const id = editing?.id ?? genId()
    let question: ReadingQuestion
    if (qType === 'mcq') {
      question = { id, type: 'mcq', questionNumber: qNumber, stem: mcqStem, options: mcqOptions, correctAnswer: mcqAnswer } satisfies McqQuestion
    } else if (qType === 'tfng') {
      question = { id, type: 'tfng', questionNumber: qNumber, statement: tfngStatement, correctAnswer: tfngAnswer } satisfies TfngQuestion
    } else if (qType === 'matching') {
      question = { id, type: 'matching', questionNumber: qNumber, stem: matchStem, options: matchOptions, correctAnswer: matchAnswer } satisfies MatchingQuestion
    } else {
      question = { id, type: 'fill-blank', questionNumber: qNumber, stem: fbStem, correctAnswer: fbAnswer, ...(fbWordLimit !== '' && { wordLimit: fbWordLimit }) } satisfies FillBlankQuestion
    }
    onSave(question)
    onClose()
  }

  const updateMcqOption = (idx: number, text: string) => {
    setMcqOptions((prev) => prev.map((o, i) => i === idx ? { ...o, text } : o))
  }

  const addMatchOption = () => {
    const nextKey = String.fromCharCode('a'.charCodeAt(0) + matchOptions.length)
    setMatchOptions((prev) => [...prev, { key: nextKey, text: '' }])
  }
  const removeMatchOption = (idx: number) => {
    setMatchOptions((prev) => prev.filter((_, i) => i !== idx))
  }
  const updateMatchOption = (idx: number, field: 'key' | 'text', value: string) => {
    setMatchOptions((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o))
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Question' : 'Add Question'} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Question Type</label>
            <Select value={qType} onChange={(e) => { setQType(e.target.value as QuestionType); setErrors({}) }} className="w-full">
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="tfng">True / False / Not Given</option>
              <option value="matching">Matching</option>
              <option value="fill-blank">Fill in the Blank</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Q Number</label>
            <Input type="number" min={1} value={qNumber} onChange={(e) => setQNumber(Number(e.target.value))} />
          </div>
        </div>

        {qType === 'mcq' && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question Stem</label>
              <Input value={mcqStem} onChange={(e) => setMcqStem(e.target.value)} placeholder="Enter the question…" />
              {errors.mcqStem && <p className="text-xs text-destructive mt-1">{errors.mcqStem}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              {mcqOptions.map((opt, i) => (
                <div key={opt.label} className="flex items-center gap-2">
                  <span className="w-5 text-xs font-mono text-muted-foreground shrink-0">{opt.label}</span>
                  <Input value={opt.text} onChange={(e) => updateMcqOption(i, e.target.value)} placeholder={`Option ${opt.label}…`} />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Correct Answer</label>
              <Select value={mcqAnswer} onChange={(e) => setMcqAnswer(e.target.value)} className="w-full">
                {mcqOptions.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
              </Select>
            </div>
          </>
        )}

        {qType === 'tfng' && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Statement</label>
              <Input value={tfngStatement} onChange={(e) => setTfngStatement(e.target.value)} placeholder="Enter the statement…" />
              {errors.tfngStatement && <p className="text-xs text-destructive mt-1">{errors.tfngStatement}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Correct Answer</label>
              <Select value={tfngAnswer} onChange={(e) => setTfngAnswer(e.target.value as 'TRUE' | 'FALSE' | 'NOT GIVEN')} className="w-full">
                <option value="TRUE">TRUE</option>
                <option value="FALSE">FALSE</option>
                <option value="NOT GIVEN">NOT GIVEN</option>
              </Select>
            </div>
          </>
        )}

        {qType === 'matching' && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question Stem</label>
              <Input value={matchStem} onChange={(e) => setMatchStem(e.target.value)} placeholder="Enter the matching instruction…" />
              {errors.matchStem && <p className="text-xs text-destructive mt-1">{errors.matchStem}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Options</label>
                <button type="button" onClick={addMatchOption} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <Plus className="h-3 w-3" /> Add option
                </button>
              </div>
              {matchOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt.key} onChange={(e) => updateMatchOption(i, 'key', e.target.value)} className="w-16 shrink-0" placeholder="key" />
                  <Input value={opt.text} onChange={(e) => updateMatchOption(i, 'text', e.target.value)} placeholder="Option text…" />
                  <button type="button" onClick={() => removeMatchOption(i)} className="text-muted-foreground hover:text-red-600 shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Correct Answer</label>
              <Input value={matchAnswer} onChange={(e) => setMatchAnswer(e.target.value)} placeholder="e.g. i" />
              {errors.matchAnswer && <p className="text-xs text-destructive mt-1">{errors.matchAnswer}</p>}
            </div>
          </>
        )}

        {qType === 'fill-blank' && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question Stem</label>
              <Input value={fbStem} onChange={(e) => setFbStem(e.target.value)} placeholder="Use ________ for the blank…" />
              {errors.fbStem && <p className="text-xs text-destructive mt-1">{errors.fbStem}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Correct Answer</label>
                <Input value={fbAnswer} onChange={(e) => setFbAnswer(e.target.value)} placeholder="Correct word(s)…" />
                {errors.fbAnswer && <p className="text-xs text-destructive mt-1">{errors.fbAnswer}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Word Limit (optional)</label>
                <Input
                  type="number"
                  min={1}
                  value={fbWordLimit}
                  onChange={(e) => setFbWordLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 2"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Question'}</Button>
        </div>
      </form>
    </Modal>
  )
}
