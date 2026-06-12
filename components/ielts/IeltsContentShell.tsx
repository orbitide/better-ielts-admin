'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { ContentTable, type ContentRow, type ServerPagination } from './ContentTable'
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
  pagination?: ServerPagination
  onApiCreate?: (data: { title: string; type: string; setId?: string; testId?: string }) => Promise<{ id: string; createdAt: string }>
  onApiUpdate?: (id: string, data: { title: string; type: string; status: IeltsStatus }) => Promise<void>
  onApiDelete?: (id: string) => Promise<void>
  onFilterChange?: (filter: { setId?: string; testId?: string }) => Promise<ContentRow[]>
  onSetFilterChange?: (filter: { setId?: string; testId?: string }) => void
  selectedSetId?: string
  selectedTestId?: string
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
  pagination,
  onApiCreate,
  onApiUpdate,
  onApiDelete,
  onFilterChange,
  onSetFilterChange,
  selectedSetId: selectedSetIdProp,
  selectedTestId: selectedTestIdProp,
}: IeltsContentShellProps) {
  const [rows, setRows] = useState(initialRows)
  useEffect(() => {
    setRows(initialRows)
  }, [initialRows])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ContentRow | null>(null)
  const isControlled = selectedSetIdProp !== undefined
  const [internalSetId, setInternalSetId] = useState('')
  const [internalTestId, setInternalTestId] = useState('')
  const selectedSetId = isControlled ? selectedSetIdProp! : internalSetId
  const selectedTestId = isControlled ? (selectedTestIdProp ?? '') : internalTestId
  const [filterLoading, setFilterLoading] = useState(false)
  const isFirstRender = useRef(true)

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!onFilterChange) return

    let cancelled = false
    setFilterLoading(true)
    onFilterChange({ setId: selectedSetId || undefined, testId: selectedTestId || undefined })
      .then((newRows) => { if (!cancelled) setRows(newRows) })
      .catch(() => { if (!cancelled) toast.error('Failed to apply filter.') })
      .finally(() => { if (!cancelled) setFilterLoading(false) })

    return () => { cancelled = true }
  }, [selectedSetId, selectedTestId, onFilterChange])

  const handleSetChange = (value: string) => {
    if (isControlled) {
      onSetFilterChange?.({ setId: value || undefined, testId: undefined })
    } else {
      setInternalSetId(value)
      setInternalTestId('')
    }
  }

  const handleTestChange = (value: string) => {
    if (isControlled) {
      onSetFilterChange?.({ setId: selectedSetId || undefined, testId: value || undefined })
    } else {
      setInternalTestId(value)
    }
  }

  const handleClear = () => {
    if (isControlled) {
      onSetFilterChange?.({ setId: undefined, testId: undefined })
    } else {
      setInternalSetId('')
      setInternalTestId('')
    }
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
        onChange={handleTestChange}
        options={(selectedSet?.tests ?? []).map((t) => ({ value: t.testId, label: t.testTitle }))}
        placeholder="All Tests"
        disabled={!selectedSet}
      />

      {selectedSetId && (
        <button
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}

      {filterLoading && <span className="text-xs text-muted-foreground">Loading…</span>}
    </div>
  ) : undefined

  return (
    <>
      <ContentTable
        key={isControlled ? undefined : `${selectedSetId}-${selectedTestId}`}
        title={title}
        description={description}
        initialRows={rows}
        onNew={handleNew}
        onEdit={handleEdit}
        onApiDelete={onApiDelete}
        manageHrefPrefix={manageHrefPrefix}
        filterSlot={filterSlot}
        statsColumns={statsColumns}
        pagination={pagination}
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
