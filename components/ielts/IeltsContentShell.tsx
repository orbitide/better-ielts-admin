'use client'

import { useState } from 'react'
import { ContentTable, type ContentRow } from './ContentTable'
import { ContentFormModal } from './ContentFormModal'
import type { IeltsStatus } from '@/lib/types/ielts'

type IeltsContentShellProps = {
  title: string
  description: string
  rows: ContentRow[]
  typeOptions?: string[]
  typeLabel?: string
}

export function IeltsContentShell({ title, description, rows: initialRows, typeOptions, typeLabel }: IeltsContentShellProps) {
  const [rows, setRows] = useState(initialRows)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ContentRow | null>(null)

  const handleNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (row: ContentRow) => {
    setEditing(row)
    setModalOpen(true)
  }

  const handleSave = ({ title: t, type, status }: { title: string; type: string; status: IeltsStatus }) => {
    if (editing) {
      setRows((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, title: t, meta: type, status } : r))
      )
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

  return (
    <>
      <ContentTable
        title={title}
        description={description}
        initialRows={rows}
        onNew={handleNew}
        onEdit={handleEdit}
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
