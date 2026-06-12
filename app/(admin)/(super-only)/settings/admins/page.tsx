import { getAdmins, getAuditLog, getAdminRoles } from '@/lib/data/admins'
import { AdminsManagementShell } from '@/components/admin-management/AdminsManagementShell'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = { title: 'Admin Management' }

export default async function AdminsPage() {
  const [admins, auditLog, roles] = await Promise.all([getAdmins(), getAuditLog(), getAdminRoles()])

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Admin Management"
        description="Manage admin accounts, assign roles, and review activity."
      />
      <AdminsManagementShell initialAdmins={admins} initialLog={auditLog} roles={roles} />
    </div>
  )
}
