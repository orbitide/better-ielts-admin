import { cookies } from 'next/headers'
import { decodeSession, ACCESS_COOKIE } from '@/lib/auth/session-edge'
import { UnauthorizedView } from '@/components/auth/UnauthorizedView'

export default async function SuperOnlyLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_COOKIE)?.value
  const session = token ? decodeSession(token) : null

  if (session?.role !== 'SuperAdmin') {
    return <UnauthorizedView requiredRole="Super Admin" />
  }

  return <>{children}</>
}
