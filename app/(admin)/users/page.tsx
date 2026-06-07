import { getUsers } from '@/lib/data/users'
import { UsersTable } from '@/components/users/UsersTable'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = { title: 'Users' }

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <PageHeader
        title="Users"
        description={`${users.length} registered users on the platform.`}
      />
      <UsersTable users={users} />
    </div>
  )
}
