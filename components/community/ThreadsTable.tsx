'use client'

import { useState } from 'react'
import { Flag, Trash2, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, DataTableToolbar, DataTablePagination, type ColumnDef } from '@/components/ui/DataTable'
import type { CommunityThread } from '@/lib/mock/community-threads'
import { RoleGate } from '@/components/auth/RoleGate'

const PAGE_SIZE = 20

export function ThreadsTable({ initialThreads }: { initialThreads: CommunityThread[] }) {
  const [threads, setThreads] = useState(initialThreads)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<CommunityThread | null>(null)

  const filtered = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.authorName.toLowerCase().includes(query.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const handleToggleFlag = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, flagged: !t.flagged } : t)))
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setThreads((prev) => prev.filter((t) => t.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const columns: ColumnDef<CommunityThread>[] = [
    {
      accessorKey: 'title',
      header: 'Thread',
      cell: ({ row }) => (
        <span className="font-medium max-w-xs truncate block">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Author',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.authorName}</span>
      ),
      meta: { className: 'hidden md:table-cell' },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
      meta: { className: 'hidden sm:table-cell' },
    },
    {
      accessorKey: 'replyCount',
      header: 'Replies',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.replyCount}</span>
      ),
    },
    {
      accessorKey: 'flagged',
      header: 'Status',
      cell: ({ row }) =>
        row.original.flagged ? (
          <Badge variant="destructive">Flagged</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <RoleGate permission="community:moderate">
            <button
              onClick={() => handleToggleFlag(row.original.id)}
              title={row.original.flagged ? 'Unflag' : 'Flag'}
              className={`rounded-md p-1.5 transition-colors ${
                row.original.flagged
                  ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                  : 'text-muted-foreground hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30'
              }`}
            >
              {row.original.flagged ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <Flag className="h-3.5 w-3.5" />
              )}
            </button>
          </RoleGate>
          <RoleGate permission="community:delete">
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Community"
        description="Moderate discussion threads and manage flagged content."
      />

      <DataTableToolbar>
        <SearchInput
          value={query}
          onChange={(q) => { setQuery(q); setPage(1) }}
          placeholder="Search threads…"
          className="max-w-xs"
        />
        <span className="text-xs text-muted-foreground">
          {threads.filter((t) => t.flagged).length} flagged
        </span>
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={paginated}
        emptyMessage="No threads found."
        getRowClassName={(row) =>
          row.flagged ? 'bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50/70 dark:hover:bg-red-900/20' : ''
        }
      />

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={filtered.length}
        sourceCount={threads.length}
        onPageChange={setPage}
        countLabel={`${filtered.length} of ${threads.length} threads`}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Thread"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
