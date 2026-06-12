'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { DataTable, type ColumnDef } from '@/components/ui/DataTable'
import { AddAdminModal } from './AddAdminModal'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import { updateAdminAccount, fetchAuditLog } from '@/lib/api/admin'
import type { AdminRoleOption, ManagedAdmin, AuditLogEntry } from '@/lib/types/admin'

const roleBadgeVariant: Record<string, 'secondary' | 'warning' | 'success'> = {
  SuperAdmin: 'success',
  ContentManager: 'warning',
  Moderator: 'secondary',
}

function formatRoleLabel(name: string) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

type Props = {
  initialAdmins: ManagedAdmin[]
  initialLog: AuditLogEntry[]
  roles: AdminRoleOption[]
}

export function AdminsManagementShell({ initialAdmins, initialLog, roles }: Props) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [auditLog, setAuditLog] = useState(initialLog)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const currentAdmin = useAdminAuthStore((s) => s.admin)

  const roleLabel = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role ? formatRoleLabel(role.name) : 'Unknown'
  }

  const refreshAuditLog = async () => {
    try {
      const log = await fetchAuditLog()
      setAuditLog(log)
    } catch {
      // keep existing log on failure
    }
  }

  const handleRoleChange = async (id: string, newRoleId: string) => {
    const target = admins.find((a) => a.id === id)
    if (!target || target.roleId === newRoleId) return

    const previousLabel = roleLabel(target.roleId)
    const nextLabel = roleLabel(newRoleId)

    try {
      const updated = await updateAdminAccount(id, { roleId: newRoleId })
      setAdmins((prev) => prev.map((a) => (a.id === id ? updated : a)))
      toast.success(`Changed ${target.name}'s role from ${previousLabel} to ${nextLabel}`)
      await refreshAuditLog()
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to update role.')
    }
  }

  const handleToggleStatus = async (id: string) => {
    const target = admins.find((a) => a.id === id)
    if (!target) return

    const nextActive = target.status !== 'active'

    try {
      const updated = await updateAdminAccount(id, { isActive: nextActive })
      setAdmins((prev) => prev.map((a) => (a.id === id ? updated : a)))
      toast.success(`${nextActive ? 'Enabled' : 'Disabled'} account for ${target.name}`)
      await refreshAuditLog()
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to update status.')
    }
  }

  const handleAddAdmin = async (newAdmin: ManagedAdmin) => {
    setAdmins((prev) => [...prev, newAdmin])
    await refreshAuditLog()
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
          <Badge variant={roleBadgeVariant[row.original.role] ?? 'secondary'}>
            {formatRoleLabel(row.original.role)}
          </Badge>
        ) : (
          <Select
            value={row.original.roleId}
            onChange={(e) => handleRoleChange(row.original.id, e.target.value)}
            className="text-xs h-7 py-0.5"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {formatRoleLabel(role.name)}
              </option>
            ))}
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
        roles={roles}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddAdmin}
      />
    </div>
  )
}
