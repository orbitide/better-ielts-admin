'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/utils'
import type { FullListeningTest, TableNode, TableRow, TableCell } from '@/lib/types/ielts'
import { genLayoutNodeId, getNextQuestionNumber, inputIdFor } from '@/lib/utils/listening-layout'
import { validateTableNode } from '@/lib/validations/listening-layout'

type Props = {
  open: boolean
  onClose: () => void
  editing: TableNode | null
  test: FullListeningTest
  onSave: (node: TableNode) => void
}

const defaultHeaders = ['Field', 'Detail']

function defaultRow(columnCount: number): TableRow {
  return {
    id: genLayoutNodeId('row'),
    cells: Array.from({ length: columnCount }, () => ({ type: 'text', value: '' }) as TableCell),
  }
}

export function TableNodeFormModal({ open, onClose, editing, test, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [headers, setHeaders] = useState<string[]>(defaultHeaders)
  const [rows, setRows] = useState<TableRow[]>([defaultRow(defaultHeaders.length)])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    if (editing) {
      setTitle(editing.title ?? '')
      setHeaders([...editing.headers])
      setRows(editing.rows.map((row) => ({ id: row.id, cells: row.cells.map((c) => ({ ...c })) })))
    } else {
      setTitle('')
      setHeaders([...defaultHeaders])
      setRows([defaultRow(defaultHeaders.length)])
    }
    setErrors({})
  }, [editing, open])

  const nextQuestionNumber = () => {
    const testMax = getNextQuestionNumber(test, editing?.id) - 1
    const draftMax = rows.reduce(
      (max, row) => row.cells.reduce((rm, cell) => (cell.type === 'input' ? Math.max(rm, cell.questionNumber) : rm), max),
      0
    )
    return Math.max(testMax, draftMax) + 1
  }

  const addColumn = () => {
    setHeaders((prev) => [...prev, ''])
    setRows((prev) => prev.map((row) => ({ ...row, cells: [...row.cells, { type: 'text', value: '' }] })))
  }

  const removeColumn = (colIndex: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== colIndex))
    setRows((prev) => prev.map((row) => ({ ...row, cells: row.cells.filter((_, i) => i !== colIndex) })))
  }

  const updateHeader = (index: number, value: string) => {
    setHeaders((prev) => prev.map((h, i) => (i === index ? value : h)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, defaultRow(headers.length)])
  }

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const updateTextCell = (rowId: string, cellIndex: number, value: string) => {
    setRows((prev) => prev.map((row) =>
      row.id === rowId
        ? { ...row, cells: row.cells.map((c, i) => (i === cellIndex && c.type === 'text' ? { ...c, value } : c)) }
        : row
    ))
  }

  const updateAnswerCell = (rowId: string, cellIndex: number, correctAnswer: string) => {
    setRows((prev) => prev.map((row) =>
      row.id === rowId
        ? { ...row, cells: row.cells.map((c, i) => (i === cellIndex && c.type === 'input' ? { ...c, correctAnswer } : c)) }
        : row
    ))
  }

  const toggleCellType = (rowId: string, cellIndex: number) => {
    setRows((prev) => prev.map((row) => {
      if (row.id !== rowId) return row
      return {
        ...row,
        cells: row.cells.map((c, i): TableCell => {
          if (i !== cellIndex) return c
          if (c.type === 'text') {
            const questionNumber = nextQuestionNumber()
            return { type: 'input', inputId: inputIdFor(questionNumber), questionNumber, correctAnswer: '' }
          }
          return { type: 'text', value: '' }
        }),
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const node: TableNode = {
      type: 'table',
      id: editing?.id ?? genLayoutNodeId('tbl'),
      title: title.trim() || undefined,
      headers,
      rows,
    }
    const validationErrors = validateTableNode(node)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(node)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Table' : 'Add Table'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title (optional)</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Booking Details" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Columns</label>
            <button type="button" onClick={addColumn} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus className="h-3 w-3" /> Add column
            </button>
          </div>
          <div className="flex gap-2">
            {headers.map((h, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <Input value={h} onChange={(e) => updateHeader(i, e.target.value)} placeholder={`Column ${i + 1}`} />
                {headers.length > 1 && (
                  <button type="button" onClick={() => removeColumn(i)} className="text-muted-foreground hover:text-red-600 shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.headers && <p className="text-xs text-destructive mt-1">{errors.headers}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Rows</label>
            <button type="button" onClick={addRow} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus className="h-3 w-3" /> Add row
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {rows.map((row) => (
              <div key={row.id} className="flex items-start gap-2 rounded-md border border-border p-2">
                <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
                  {row.cells.map((cell, i) => (
                    <div key={i} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleCellType(row.id, i)}
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wide rounded px-1.5 py-0.5',
                          cell.type === 'input' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {cell.type === 'input' ? `Input · Q${cell.questionNumber}` : 'Text'}
                      </button>
                      {cell.type === 'text' ? (
                        <Input value={cell.value} onChange={(e) => updateTextCell(row.id, i, e.target.value)} placeholder="Cell text…" />
                      ) : (
                        <Input value={cell.correctAnswer} onChange={(e) => updateAnswerCell(row.id, i, e.target.value)} placeholder="Correct answer…" />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="text-muted-foreground hover:text-red-600 shrink-0 mt-1 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.rows && <p className="text-xs text-destructive mt-1">{errors.rows}</p>}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Table'}</Button>
        </div>
      </form>
    </Modal>
  )
}
