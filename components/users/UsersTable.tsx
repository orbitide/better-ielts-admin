'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import type { User } from '@/lib/types/user'

const planVariant: Record<string, 'default' | 'success' | 'secondary'> = {
  elite: 'default',
  pro: 'success',
  free: 'secondary',
}

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    const matchesPlan = planFilter === 'all' || u.plan === planFilter
    return matchesQuery && matchesPlan
  })

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
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/users/${user.id}`} className="flex items-center gap-2.5 group">
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={28}
                        height={28}
                        className="rounded-full border border-border shrink-0"
                      />
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
                    <Badge variant={planVariant[user.plan]}>{user.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.totalStudyHours}h</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{user.joinedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {users.length} users</p>
    </div>
  )
}
