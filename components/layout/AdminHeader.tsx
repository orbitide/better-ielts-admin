'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import Image from 'next/image'

export function AdminHeader() {
  const admin = useAdminAuthStore((s) => s.admin)
  const logout = useAdminAuthStore((s) => s.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-5 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:block">{admin?.email}</span>
        {admin?.avatarUrl && (
          <Image
            src={admin.avatarUrl}
            alt={admin.name}
            width={28}
            height={28}
            className="rounded-full border border-border"
          />
        )}
        <button
          onClick={handleLogout}
          title="Log out"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
