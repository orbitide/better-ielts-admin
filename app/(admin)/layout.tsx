import { AuthGate } from '@/components/layout/AuthGate'
import { AdminShell } from '@/components/layout/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  )
}
