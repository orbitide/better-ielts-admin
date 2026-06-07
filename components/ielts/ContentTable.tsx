'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import type { IeltsStatus } from '@/lib/types/ielts'

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
  manageHrefPrefix?: string
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

export function ContentTable({ title, description, initialRows, onNew, onEdit, manageHrefPrefix }: ContentTableProps) {
  const [rows, setRows] = useState(initialRows)
  const [query, setQuery] = useState('')
  const [, startTransition] = useTransition()

  const filtered = rows.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = (id: string) => {
    startTransition(() => setRows((prev) => prev.filter((r) => r.id !== id)))
  }

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-5xl mx-auto">
      <PageHeader title={title} description={description}>
        <Button onClick={onNew} size="sm">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} className="max-w-xs" />

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
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Edit metadata"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {rows.length} items</p>
    </div>
  )
}
