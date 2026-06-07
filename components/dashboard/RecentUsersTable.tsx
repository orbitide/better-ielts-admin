import Image from 'next/image'
import Link from 'next/link'
import type { User } from '@/lib/types/user'
import { Badge } from '@/components/ui/Badge'

const planVariant: Record<string, 'default' | 'success' | 'secondary'> = {
  elite: 'default',
  pro: 'success',
  free: 'secondary',
}

export function RecentUsersTable({ users }: { users: User[] }) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/users/${user.id}`}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors"
        >
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={28}
            height={28}
            className="rounded-full border border-border shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
          <Badge variant={planVariant[user.plan]}>{user.plan}</Badge>
        </Link>
      ))}
    </div>
  )
}
