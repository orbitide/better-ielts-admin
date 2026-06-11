'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { ContentTable, type ContentRow } from './ContentTable'
import { ContentFormModal, type SetOption } from './ContentFormModal'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
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
  createSetOptions?: SetOption[]
  statsColumns?: { key: string; header: string }[]
  onApiCreate?: (data: { title: string; type: string; setId?: string; testId?: string }) => Promise<{ id: string; createdAt: string }>
  onApiUpdate?: (id: string, data: { title: string; type: string; status: IeltsStatus }) => Promise<void>
  onApiDelete?: (id: string) => Promise<void>
}

export function IeltsContentShell({
  title,
  description,
  rows: initialRows,
  typeOptions,
  typeLabel,
  manageHrefPrefix,
  setFilters,
  createSetOptions,
  statsColumns,
  onApiCreate,
  onApiUpdate,
  onApiDelete,
}: IeltsContentShellProps) {
  const [rows, setRows] = useState(initialRows)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ContentRow | null>(null)
  const [selectedSetId, setSelectedSetId] = useState('')
  const [selectedTestId, setSelectedTestId] = useState('')

  const handleNew = () => { setEditing(null); setModalOpen(true) }
  const handleEdit = (row: ContentRow) => { setEditing(row); setModalOpen(true) }

  const handleSave = async ({ title: t, type, status, setId, testId }: { title: string; type: string; status: IeltsStatus; setId?: string; testId?: string }) => {
    if (editing) {
      if (onApiUpdate) {
        try {
          await onApiUpdate(editing.id, { title: t, type, status })
          toast.success('Changes saved.')
        } catch (err) {
          toast.error((err as Error).message ?? 'Failed to save changes.')
          return
        }
      }
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, title: t, meta: type, status } : r)))
    } else {
      if (onApiCreate) {
        let result: { id: string; createdAt: string }
        try {
          result = await onApiCreate({ title: t, type, setId, testId })
          toast.success('Created successfully.')
        } catch (err) {
          toast.error((err as Error).message ?? 'Failed to create.')
          return
        }
        setRows((prev) => [{ id: result.id, title: t, meta: type, status, createdAt: result.createdAt }, ...prev])
      } else {
        setRows((prev) => [{ id: `new-${Date.now()}`, title: t, meta: type, status, createdAt: new Date().toISOString().slice(0, 10) }, ...prev])
      }
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

  const filterSlot = setFilters ? (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Set:</span>
      <SearchableSelect
        value={selectedSetId}
        onChange={handleSetChange}
        options={setFilters.map((s) => ({ value: s.setId, label: s.setTitle }))}
        placeholder="All Sets"
      />

      <span className="text-xs font-medium text-muted-foreground">Test:</span>
      <SearchableSelect
        value={selectedTestId}
        onChange={setSelectedTestId}
        options={(selectedSet?.tests ?? []).map((t) => ({ value: t.testId, label: t.testTitle }))}
        placeholder="All Tests"
        disabled={!selectedSet}
      />

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
        onApiDelete={onApiDelete}
        manageHrefPrefix={manageHrefPrefix}
        filterSlot={filterSlot}
        statsColumns={statsColumns}
      />
      <ContentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        typeOptions={typeOptions}
        typeLabel={typeLabel}
        setOptions={createSetOptions}
        onSave={handleSave}
      />
    </>
  )
}
