'use client'

import { Mail, Shield, User } from 'lucide-react'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  content_manager: 'Content Manager',
  moderator: 'Moderator',
}

export default function ProfilePage() {
  const admin = useAdminAuthStore((s) => s.admin)

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="Profile" description="Your account information." />

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{admin?.name ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 border-b border-border">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{admin?.email ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium">
                {admin?.role ? (roleLabels[admin.role] ?? admin.role) : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
