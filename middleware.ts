import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session-edge'
import { canAccessRoute } from '@/lib/auth/permissions'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    )
  }

  const session = decodeSession(token)
  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(SESSION_COOKIE_NAME)
    return response
  }

  if (!canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Refresh cookie maxAge on each request (sliding session window)
  const response = NextResponse.next()
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/ielts/:path*',
    '/content/:path*',
    '/community/:path*',
    '/subscriptions/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
}
