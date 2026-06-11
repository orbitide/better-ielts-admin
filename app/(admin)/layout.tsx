import { connection } from 'next/server'
import { AuthGate } from '@/components/layout/AuthGate'
import { AdminShell } from '@/components/layout/AdminShell'
import { SessionWatcher } from '@/components/auth/SessionWatcher'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection()

  return (
    <AuthGate>
      <SessionWatcher />
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  )
}
