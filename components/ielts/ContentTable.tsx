'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import type { IeltsStatus } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'

export type ContentRow = {
  id: string
  title: string
  meta: string
  status: IeltsStatus
  createdAt: string
}

type ContentTableProps = {
  title: string
  description: string
  initialRows: ContentRow[]
  onNew: () => void
  onEdit: (row: ContentRow) => void
  onApiDelete?: (id: string) => Promise<void>
  manageHrefPrefix?: string
  filterSlot?: ReactNode
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

export function ContentTable({ title, description, initialRows, onNew, onEdit, onApiDelete, manageHrefPrefix, filterSlot }: ContentTableProps) {
  const [rows, setRows] = useState(initialRows)
  const [query, setQuery] = useState('')
  const [, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<ContentRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const filtered = rows.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    if (onApiDelete) {
      setDeleting(true)
      try {
        await onApiDelete(deleteTarget.id)
        startTransition(() => setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id)))
        router.refresh()
      } catch {
        // leave rows unchanged on error
      } finally {
        setDeleting(false)
      }
    } else {
      startTransition(() => setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id)))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-5xl mx-auto">
      <PageHeader title={title} description={description}>
        <RoleGate permission="ielts:edit">
          <Button onClick={onNew} size="sm">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </RoleGate>
      </PageHeader>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} className="max-w-xs" />
        {filterSlot}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Title</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Details</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Created</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                  No items found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{row.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.meta}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {manageHrefPrefix && (
                        <Link
                          href={`${manageHrefPrefix}/${row.id}`}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Manage content"
                        >
                          <Settings2 className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <RoleGate permission="ielts:edit">
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Edit metadata"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                      <RoleGate permission="ielts:delete">
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {rows.length} items</p>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Item">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
