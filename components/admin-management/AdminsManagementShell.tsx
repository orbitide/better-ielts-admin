'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { AddAdminModal } from './AddAdminModal'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import type { ManagedAdmin, AuditLogEntry } from '@/lib/types/admin'

const roleLabels: Record<ManagedAdmin['role'], string> = {
  super_admin: 'Super Admin',
  content_manager: 'Content Manager',
  moderator: 'Moderator',
}

const roleBadgeVariant: Record<ManagedAdmin['role'], 'secondary' | 'warning' | 'success'> = {
  super_admin: 'success',
  content_manager: 'warning',
  moderator: 'secondary',
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
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Admin</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Role</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((admin) => {
                  const isSelf = admin.id === currentAdmin?.id
                  return (
                    <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{admin.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{admin.email}</td>
                      <td className="px-4 py-3">
                        {isSelf ? (
                          <Badge variant={roleBadgeVariant[admin.role]}>{roleLabels[admin.role]}</Badge>
                        ) : (
                          <Select
                            value={admin.role}
                            onChange={(e) => handleRoleChange(admin.id, e.target.value as ManagedAdmin['role'])}
                            className="text-xs h-7 py-0.5"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="content_manager">Content Manager</option>
                            <option value="moderator">Moderator</option>
                          </Select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={admin.status === 'active' ? 'success' : 'secondary'}>
                          {admin.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleToggleStatus(admin.id)}
                            className={`text-xs rounded-md px-2 py-1 border transition-colors ${
                              admin.status === 'active'
                                ? 'border-border text-muted-foreground hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'border-border text-muted-foreground hover:border-green-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            {admin.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
