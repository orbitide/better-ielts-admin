'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, DataTableToolbar, type ColumnDef } from '@/components/ui/DataTable'
import type { IeltsStatus } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'

export type ContentRow = {
  id: string
  title: string
  meta: string
  type?: string
  testCount?: string
  difficulty?: string
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
        toast.success('Deleted successfully.')
      } catch (err) {
        toast.error((err as Error).message ?? 'Failed to delete.')
      } finally {
        setDeleting(false)
      }
    } else {
      startTransition(() => setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id)))
    }
    setDeleteTarget(null)
  }

  const hasExpandedCols = rows.length > 0 && rows[0].type !== undefined

  const columns: ColumnDef<ContentRow>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <span className="font-medium max-w-xs truncate block">{row.original.title}</span>,
    },
    ...(hasExpandedCols
      ? [
          {
            accessorKey: 'type',
            header: 'Type',
            enableSorting: false,
            cell: ({ row }: { row: { original: ContentRow } }) => <span className="text-muted-foreground capitalize">{row.original.type}</span>,
            meta: { className: 'hidden sm:table-cell' },
          },
          {
            accessorKey: 'testCount',
            header: 'Tests',
            enableSorting: false,
            cell: ({ row }: { row: { original: ContentRow } }) => <span className="text-muted-foreground">{row.original.testCount}</span>,
            meta: { className: 'hidden sm:table-cell' },
          },
          {
            accessorKey: 'difficulty',
            header: 'Difficulty',
            enableSorting: false,
            cell: ({ row }: { row: { original: ContentRow } }) => <span className="text-muted-foreground capitalize">{row.original.difficulty}</span>,
            meta: { className: 'hidden sm:table-cell' },
          },
        ] as ColumnDef<ContentRow>[]
      : [
          {
            accessorKey: 'meta',
            header: 'Details',
            enableSorting: false,
            cell: ({ row }: { row: { original: ContentRow } }) => <span className="text-muted-foreground">{row.original.meta}</span>,
            meta: { className: 'hidden sm:table-cell' },
          },
        ] as ColumnDef<ContentRow>[]),
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.createdAt}</span>,
      meta: { className: 'hidden md:table-cell' },
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          {manageHrefPrefix && (
            <Link
              href={`${manageHrefPrefix}/${row.original.id}`}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors inline-flex"
              title="Manage content"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Link>
          )}
          <RoleGate permission="ielts:edit">
            <button
              onClick={() => onEdit(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Edit metadata"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
          <RoleGate permission="ielts:delete">
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
        </div>
      ),
    },
  ]

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

      <DataTableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} className="max-w-xs" />
        {filterSlot}
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No items found."
      />

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
