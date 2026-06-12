import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeSession, ACCESS_COOKIE } from '@/lib/auth/session-edge'
import { canAccessRoute } from '@/lib/auth/permissions'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  console.log('access token', token);
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    )
  }

  const session = decodeSession(token)
  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(ACCESS_COOKIE)
    return response
  }

  if (!canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

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
