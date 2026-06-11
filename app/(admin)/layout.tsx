import { AuthGate } from '@/components/layout/AuthGate'
import { AdminShell } from '@/components/layout/AdminShell'
import { SessionWatcher } from '@/components/auth/SessionWatcher'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <SessionWatcher />
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  )
}
