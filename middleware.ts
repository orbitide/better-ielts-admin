import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // TODO: re-enable cookie-based auth check (incl. canAccessRoute permission
  // check via decodeSession/ACCESS_COOKIE) once the API is proxied through
  // this app's origin (currently auth_access is set on the API origin, e.g.
  // localhost:5000, so this middleware can never see it). Until then, auth
  // is enforced client-side via AuthGate + the Zustand auth store bootstrap.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/ielts/:path*',
    '/content/:path*',
    '/subscriptions/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
}
