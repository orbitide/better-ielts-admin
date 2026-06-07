'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { UserAvatar } from '@/components/users/UserAvatar'
import { UserActionsMenu } from '@/components/users/UserActionsMenu'
import { EditUserModal } from '@/components/users/EditUserModal'
import type { User } from '@/lib/types/user'

const PAGE_SIZE = 10

const planVariant: Record<string, 'default' | 'success' | 'secondary'> = {
  elite: 'default',
  pro: 'success',
  free: 'secondary',
}

function toggleSet(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function UsersTable({ users }: { users: User[] }) {
  const [localUsers, setLocalUsers] = useState(users)
  const [suspended, setSuspended] = useState<Set<string>>(new Set())
  const [banned, setBanned] = useState<Set<string>>(new Set())
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [banTarget, setBanTarget] = useState<User | null>(null)

  const [query, setQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = localUsers.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    const matchesPlan = planFilter === 'all' || u.plan === planFilter
    return matchesQuery && matchesPlan
  })

  useEffect(() => {
    setPage(1)
  }, [query, planFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleEdit(updated: User) {
    setLocalUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  function handleDelete(id: string) {
    setLocalUsers((prev) => prev.filter((u) => u.id !== id))
    setBanned((prev) => { const next = new Set(prev); next.delete(id); return next })
    setSuspended((prev) => { const next = new Set(prev); next.delete(id); return next })
    setDeleteTarget(null)
  }

  function handleBan(id: string) {
    setBanned((prev) => new Set(prev).add(id))
    setSuspended((prev) => { const next = new Set(prev); next.delete(id); return next })
    setBanTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name or email…"
          className="max-w-xs"
        />
        <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="elite">Elite</option>
        </Select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">User</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Band</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Plan</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Hours</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden lg:table-cell">Joined</th>
              <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/users/${user.id}`} className="flex items-center gap-2.5 group">
                      <UserAvatar name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium group-hover:text-primary transition-colors leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono font-semibold text-primary">{user.currentBand.overall}</span>
                    <span className="text-muted-foreground text-xs ml-1">/ target {user.targetBand}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={planVariant[user.plan]}>{user.plan}</Badge>
                      {suspended.has(user.id) && <Badge variant="warning">suspended</Badge>}
                      {banned.has(user.id) && <Badge variant="destructive">banned</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.totalStudyHours}h</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{user.joinedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <UserActionsMenu
                        user={user}
                        suspended={suspended.has(user.id)}
                        banned={banned.has(user.id)}
                        onEdit={setEditTarget}
                        onDelete={setDeleteTarget}
                        onBan={setBanTarget}
                        onToggleStatus={(u) => setSuspended((prev) => toggleSet(prev, u.id))}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} of {localUsers.length} users</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-xs text-muted-foreground px-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <EditUserModal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        user={editTarget}
        onSave={handleEdit}
      />

      {/* Delete confirmation modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => deleteTarget && handleDelete(deleteTarget.id)}>Delete</Button>
        </div>
      </Modal>

      {/* Ban confirmation modal */}
      <Modal
        open={banTarget !== null}
        onClose={() => setBanTarget(null)}
        title="Ban User"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to ban <span className="font-semibold text-foreground">{banTarget?.name}</span>? They will lose access to the platform.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setBanTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => banTarget && handleBan(banTarget.id)}>Ban User</Button>
        </div>
      </Modal>
    </div>
  )
}
