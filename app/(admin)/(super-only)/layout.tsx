import { cookies } from 'next/headers'
import { decodeSession, SESSION_COOKIE_NAME } from '@/lib/auth/session'
import { UnauthorizedView } from '@/components/auth/UnauthorizedView'

export default async function SuperOnlyLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const session = token ? decodeSession(token) : null

  if (session?.role !== 'super_admin') {
    return <UnauthorizedView requiredRole="Super Admin" />
  }

  return <>{children}</>
}
