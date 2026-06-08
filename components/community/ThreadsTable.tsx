'use client'

import { useState } from 'react'
import { Flag, Trash2, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import type { CommunityThread } from '@/lib/mock/community-threads'
import { RoleGate } from '@/components/auth/RoleGate'

export function ThreadsTable({ initialThreads }: { initialThreads: CommunityThread[] }) {
  const [threads, setThreads] = useState(initialThreads)
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<CommunityThread | null>(null)

  const filtered = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.authorName.toLowerCase().includes(query.toLowerCase())
  )

  const handleToggleFlag = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, flagged: !t.flagged } : t))
    )
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setThreads((prev) => prev.filter((t) => t.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Community" description="Moderate discussion threads and manage flagged content." />

      <div className="flex items-center gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search threads…" className="max-w-xs" />
        <span className="text-xs text-muted-foreground">
          {threads.filter((t) => t.flagged).length} flagged
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Thread</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Author</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Replies</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No threads found.
                </td>
              </tr>
            ) : (
              filtered.map((thread) => (
                <tr
                  key={thread.id}
                  className={thread.flagged ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-muted/30 transition-colors'}
                >
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{thread.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{thread.authorName}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="secondary">{thread.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{thread.replyCount}</td>
                  <td className="px-4 py-3">
                    {thread.flagged ? (
                      <Badge variant="destructive">Flagged</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <RoleGate permission="community:moderate">
                        <button
                          onClick={() => handleToggleFlag(thread.id)}
                          title={thread.flagged ? 'Unflag' : 'Flag'}
                          className={`rounded-md p-1.5 transition-colors ${
                            thread.flagged
                              ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                              : 'text-muted-foreground hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30'
                          }`}
                        >
                          {thread.flagged ? <CheckCircle className="h-3.5 w-3.5" /> : <Flag className="h-3.5 w-3.5" />}
                        </button>
                      </RoleGate>
                      <RoleGate permission="community:delete">
                        <button
                          onClick={() => setDeleteTarget(thread)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
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

      <p className="text-xs text-muted-foreground">{filtered.length} of {threads.length} threads</p>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Thread">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
