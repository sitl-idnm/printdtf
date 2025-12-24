import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/shared/edge/session'

export async function middleware (req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/lk')) {
    const cookieName = getSessionCookieName()
    const token = req.cookies.get(cookieName)?.value
    const session = await verifySessionToken(token)
    if (!session?.phone) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/lk', '/lk/:path*']
}
