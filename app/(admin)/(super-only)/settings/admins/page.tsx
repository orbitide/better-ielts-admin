'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAdmins, getAuditLog, getAdminRoles } from '@/lib/data/admins'
import { AdminsManagementShell } from '@/components/admin-management/AdminsManagementShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Loading } from '@/components/ui/Loading'
import type { AdminRoleOption, ManagedAdmin, AuditLogEntry } from '@/lib/types/admin'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<ManagedAdmin[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [roles, setRoles] = useState<AdminRoleOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([getAdmins(), getAuditLog(), getAdminRoles()])
      .then(([adminsData, auditLogData, rolesData]) => {
        if (cancelled) return
        setAdmins(adminsData)
        setAuditLog(auditLogData)
        setRoles(rolesData)
      })
      .catch((err) => {
        if (!cancelled) toast.error((err as Error).message ?? 'Failed to load admin management data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Admin Management"
        description="Manage admin accounts, assign roles, and review activity."
      />
      {loading ? (
        <Loading />
      ) : (
        <AdminsManagementShell initialAdmins={admins} initialLog={auditLog} roles={roles} />
      )}
    </div>
  )
}
