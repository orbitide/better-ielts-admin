'use client'

import { useEffect, useState } from 'react'
import { fetchAdminUsers } from '@/lib/api/admin'
import { UsersTable } from '@/components/users/UsersTable'
import { ActiveUsersBadge } from '@/components/users/ActiveUsersBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import type { User } from '@/lib/types/user'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminUsers()
      .then((result) => {
        setUsers(result.items)
        setTotalCount(result.totalCount)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <PageHeader
        title="Users"
        description={loading ? 'Loading users…' : `${totalCount} registered users on the platform.`}
      >
        <ActiveUsersBadge />
      </PageHeader>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}
