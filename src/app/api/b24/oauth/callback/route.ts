import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/shared/server/b24OAuth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get('code')
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }
    const rec = await exchangeCodeForToken(code)
    if (!rec) {
      return NextResponse.json({ error: 'OAuth exchange failed' }, { status: 500 })
    }
    // Redirect to LK or root (absolute URL required)
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof req.nextUrl?.origin === 'string' ? req.nextUrl.origin : '')
    const target = base ? new URL('/lk', base).toString() : req.url.replace(/\/api\/b24\/oauth\/callback.*/,'/lk')
    return NextResponse.redirect(target, { status: 302 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}

