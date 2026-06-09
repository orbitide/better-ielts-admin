'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { DataTable, type ColumnDef } from '@/components/ui/DataTable'
import { AddAdminModal } from './AddAdminModal'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import type { ManagedAdmin, AuditLogEntry } from '@/lib/types/admin'

const roleLabels: Record<ManagedAdmin['role'], string> = {
  SuperAdmin: 'Super Admin',
  ContentManager: 'Content Manager',
  Moderator: 'Moderator',
}

const roleBadgeVariant: Record<ManagedAdmin['role'], 'secondary' | 'warning' | 'success'> = {
  SuperAdmin: 'success',
  ContentManager: 'warning',
  Moderator: 'secondary',
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

type Props = {
  initialAdmins: ManagedAdmin[]
  initialLog: AuditLogEntry[]
}

export function AdminsManagementShell({ initialAdmins, initialLog }: Props) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [auditLog, setAuditLog] = useState(initialLog)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const currentAdmin = useAdminAuthStore((s) => s.admin)

  const addEntry = (action: string) => {
    if (!currentAdmin) return
    setAuditLog((prev) => [
      {
        id: `al-${Date.now()}`,
        adminId: currentAdmin.id,
        adminName: currentAdmin.name,
        action,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const handleRoleChange = (id: string, newRole: ManagedAdmin['role']) => {
    const target = admins.find((a) => a.id === id)
    if (!target || target.role === newRole) return
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, role: newRole } : a))
    addEntry(`Changed ${target.name}'s role from ${roleLabels[target.role]} to ${roleLabels[newRole]}`)
  }

  const handleToggleStatus = (id: string) => {
    const target = admins.find((a) => a.id === id)
    if (!target) return
    const newStatus = target.status === 'active' ? 'disabled' : 'active'
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a))
    addEntry(`${newStatus === 'disabled' ? 'Disabled' : 'Enabled'} account for ${target.name}`)
  }

  const handleAddAdmin = (newAdmin: ManagedAdmin) => {
    setAdmins((prev) => [...prev, newAdmin])
    addEntry(`Added new admin account: ${newAdmin.name} (${roleLabels[newAdmin.role]})`)
  }

  const adminColumns: ColumnDef<ManagedAdmin>[] = [
    {
      accessorKey: 'name',
      header: 'Admin',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: false,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      meta: { className: 'hidden sm:table-cell' },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      enableSorting: false,
      cell: ({ row }) => {
        const isSelf = row.original.id === currentAdmin?.id
        return isSelf ? (
          <Badge variant={roleBadgeVariant[row.original.role]}>{roleLabels[row.original.role]}</Badge>
        ) : (
          <Select
            value={row.original.role}
            onChange={(e) => handleRoleChange(row.original.id, e.target.value as ManagedAdmin['role'])}
            className="text-xs h-7 py-0.5"
          >
            <option value="SuperAdmin">Super Admin</option>
            <option value="ContentManager">Content Manager</option>
            <option value="Moderator">Moderator</option>
          </Select>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => {
        const isSelf = row.original.id === currentAdmin?.id
        return (
          <div className="flex justify-end">
            {!isSelf && (
              <button
                onClick={() => handleToggleStatus(row.original.id)}
                className={`text-xs rounded-md px-2 py-1 border transition-colors ${
                  row.original.status === 'active'
                    ? 'border-border text-muted-foreground hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'border-border text-muted-foreground hover:border-green-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                {row.original.status === 'active' ? 'Disable' : 'Enable'}
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>Manage roles and account status.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Admin
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={adminColumns}
            data={admins}
            className="border-0 rounded-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Activity Log
          </CardTitle>
          <CardDescription>Recent admin actions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {auditLog.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {auditLog.slice(0, 20).map((entry) => (
                <li key={entry.id} className="px-4 py-3 flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.adminName} · {formatTimestamp(entry.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AddAdminModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddAdmin}
      />
    </div>
  )
}
