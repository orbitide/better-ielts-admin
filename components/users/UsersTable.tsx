'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { UserAvatar } from '@/components/users/UserAvatar'
import { UserActionsMenu } from '@/components/users/UserActionsMenu'
import { EditUserModal } from '@/components/users/EditUserModal'
import { DataTable, DataTableToolbar, DataTablePagination, type ColumnDef } from '@/components/ui/DataTable'
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <Link href={`/users/${row.original.id}`} className="flex items-center gap-2.5 group">
          <UserAvatar name={row.original.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium group-hover:text-primary transition-colors leading-none">{row.original.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{row.original.email}</p>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: 'currentBand',
      header: 'Band',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <span className="font-mono font-semibold text-primary">{row.original.currentBand.overall}</span>
          <span className="text-muted-foreground text-xs ml-1">/ target {row.original.targetBand}</span>
        </>
      ),
      meta: { className: 'hidden md:table-cell' },
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={planVariant[row.original.plan]}>{row.original.plan}</Badge>
          {suspended.has(row.original.id) && <Badge variant="warning">suspended</Badge>}
          {banned.has(row.original.id) && <Badge variant="destructive">banned</Badge>}
        </div>
      ),
    },
    {
      accessorKey: 'totalStudyHours',
      header: 'Hours',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.totalStudyHours}h</span>,
      meta: { className: 'hidden sm:table-cell' },
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.joinedAt}</span>,
      meta: { className: 'hidden lg:table-cell' },
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserActionsMenu
            user={row.original}
            suspended={suspended.has(row.original.id)}
            banned={banned.has(row.original.id)}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onBan={setBanTarget}
            onToggleStatus={(u) => setSuspended((prev) => toggleSet(prev, u.id))}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <DataTableToolbar>
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
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={paginated}
        emptyMessage="No users found."

      />

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={filtered.length}
        sourceCount={localUsers.length}
        onPageChange={setPage}
        countLabel={`${filtered.length} of ${localUsers.length} users`}
      />

      <EditUserModal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        user={editTarget}
        onSave={handleEdit}
      />

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
