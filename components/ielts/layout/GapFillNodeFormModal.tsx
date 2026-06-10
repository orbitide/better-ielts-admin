'use client'

import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { FullListeningTest, GapFillNode, GapFillBlock } from '@/lib/types/ielts'
import { genLayoutNodeId, getNextQuestionNumber, inputIdFor } from '@/lib/utils/listening-layout'
import { validateGapFillNode } from '@/lib/validations/listening-layout'

type Props = {
  open: boolean
  onClose: () => void
  editing: GapFillNode | null
  test: FullListeningTest
  onSave: (node: GapFillNode) => void
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

function parseGapFillText(rawText: string, startQuestionNumber: number): GapFillBlock[] {
  const blocks: GapFillBlock[] = []
  const regex = /\{\{(.*?)\}\}/g
  let lastIndex = 0
  let qNum = startQuestionNumber
  let match: RegExpExecArray | null
  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', value: rawText.slice(lastIndex, match.index) })
    }
    blocks.push({ type: 'input', inputId: inputIdFor(qNum), questionNumber: qNum, correctAnswer: match[1].trim() })
    qNum++
    lastIndex = regex.lastIndex
  }
  if (lastIndex < rawText.length) {
    blocks.push({ type: 'text', value: rawText.slice(lastIndex) })
  }
  return blocks
}

function serializeGapFillBlocks(blocks: GapFillBlock[]): string {
  return blocks.map((b) => (b.type === 'text' ? b.value : `{{${b.correctAnswer}}}`)).join('')
}

export function GapFillNodeFormModal({ open, onClose, editing, test, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [rawText, setRawText] = useState('')
  const [startQuestionNumber, setStartQuestionNumber] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setTitle(editing.title ?? '')
      setRawText(serializeGapFillBlocks(editing.blocks))
      const firstInput = editing.blocks.find((b) => b.type === 'input')
      setStartQuestionNumber(firstInput?.type === 'input' ? firstInput.questionNumber : getNextQuestionNumber(test, editing.id))
    } else {
      setTitle('')
      setRawText('')
      setStartQuestionNumber(getNextQuestionNumber(test))
    }
    setErrors({})
  }, [editing, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const previewBlocks = useMemo(() => parseGapFillText(rawText, startQuestionNumber), [rawText, startQuestionNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const node: GapFillNode = {
      type: 'gap_fill',
      id: editing?.id ?? genLayoutNodeId('gap'),
      title: title.trim() || undefined,
      blocks: previewBlocks,
    }
    const validationErrors = validateGapFillNode(node)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(node)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Gap Fill' : 'Add Gap Fill'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title (optional)</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summary Completion" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Passage</label>
          <p className="text-xs text-muted-foreground">
            Mark blanks inline using double braces, e.g. <code className="font-mono">He lives in {'{{London}}'}.</code>
          </p>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            className={textareaClass}
            placeholder="Type the passage. Mark blanks like: The man's name is {{John Smith}}."
          />
          {errors.blocks && <p className="text-xs text-destructive mt-1">{errors.blocks}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Preview</label>
          <div className="rounded-md border border-border bg-muted/20 p-3 text-sm leading-loose">
            {previewBlocks.length === 0 ? (
              <span className="text-muted-foreground">Nothing to preview yet.</span>
            ) : (
              previewBlocks.map((block, i) =>
                block.type === 'text' ? (
                  <span key={i} className="whitespace-pre-wrap">{block.value}</span>
                ) : (
                  <span key={i} className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 mx-0.5 text-xs font-mono text-primary">
                    Q{block.questionNumber}: ___{block.correctAnswer || '…'}___
                  </span>
                )
              )
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Gap Fill'}</Button>
        </div>
      </form>
    </Modal>
  )
}
