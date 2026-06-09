import { getRoles, getAllPermissions } from '@/lib/data/roles'
import { RolesManagementShell } from '@/components/role-management/RolesManagementShell'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = { title: 'Role & Permission Management' }

export default async function RolesPage() {
  const [roles, permissions] = await Promise.all([getRoles(), getAllPermissions()])

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Role & Permission Management"
        description="Create roles and control which permissions each role has."
      />
      <RolesManagementShell initialRoles={roles} allPermissions={permissions} />
    </div>
  )
}
