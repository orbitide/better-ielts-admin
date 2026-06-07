'use client'

import { useState, useMemo } from 'react'
import { ContentTable, type ContentRow } from './ContentTable'
import { ContentFormModal } from './ContentFormModal'
import { Select } from '@/components/ui/Select'
import type { IeltsStatus } from '@/lib/types/ielts'

export type SetFilterTest = {
  testId: string
  testTitle: string
  skillContentId: string
}

export type SetFilterOption = {
  setId: string
  setTitle: string
  tests: SetFilterTest[]
}

type IeltsContentShellProps = {
  title: string
  description: string
  rows: ContentRow[]
  typeOptions?: string[]
  typeLabel?: string
  manageHrefPrefix?: string
  setFilters?: SetFilterOption[]
}

export function IeltsContentShell({
  title,
  description,
  rows: initialRows,
  typeOptions,
  typeLabel,
  manageHrefPrefix,
  setFilters,
}: IeltsContentShellProps) {
  const [rows, setRows] = useState(initialRows)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ContentRow | null>(null)
  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')

  const handleNew = () => { setEditing(null); setModalOpen(true) }
  const handleEdit = (row: ContentRow) => { setEditing(row); setModalOpen(true) }

  const handleSave = ({ title: t, type, status }: { title: string; type: string; status: IeltsStatus }) => {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, title: t, meta: type, status } : r)))
    } else {
      const newRow: ContentRow = {
        id: `new-${Date.now()}`,
        title: t,
        meta: type,
        status,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setRows((prev) => [newRow, ...prev])
    }
  }

  const selectedSet = setFilters?.find((s) => s.setId === selectedSetId)

  const filteredRows = useMemo(() => {
    if (!selectedSetId || !selectedSet) return rows
    if (selectedTestId) {
      const testFilter = selectedSet.tests.find((t) => t.testId === selectedTestId)
      return testFilter ? rows.filter((r) => r.id === testFilter.skillContentId) : rows
    }
    const ids = new Set(selectedSet.tests.map((t) => t.skillContentId))
    return rows.filter((r) => ids.has(r.id))
  }, [rows, selectedSetId, selectedTestId, selectedSet])

  const handleSetChange = (value: string) => {
    setSelectedSetId(value)
    setSelectedTestId('')
  }

  const filterSlot = setFilters && setFilters.length > 0 ? (
    <div className="flex items-center gap-2">
      <Select
        value={selectedSetId}
        onChange={(e) => handleSetChange(e.target.value)}
      >
        <option value="">All Sets</option>
        {setFilters.map((s) => (
          <option key={s.setId} value={s.setId}>{s.setTitle}</option>
        ))}
      </Select>

      {selectedSet && (
        <Select
          value={selectedTestId}
          onChange={(e) => setSelectedTestId(e.target.value)}
        >
          <option value="">All Tests</option>
          {selectedSet.tests.map((t) => (
            <option key={t.testId} value={t.testId}>{t.testTitle}</option>
          ))}
        </Select>
      )}

      {selectedSetId && (
        <button
          onClick={() => { setSelectedSetId(''); setSelectedTestId('') }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  ) : undefined

  return (
    <>
      <ContentTable
        key={`${selectedSetId}-${selectedTestId}`}
        title={title}
        description={description}
        initialRows={filteredRows}
        onNew={handleNew}
        onEdit={handleEdit}
        manageHrefPrefix={manageHrefPrefix}
        filterSlot={filterSlot}
      />
      <ContentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        typeOptions={typeOptions}
        typeLabel={typeLabel}
        onSave={handleSave}
      />
    </>
  )
}
