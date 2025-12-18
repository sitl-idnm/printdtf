import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/shared/server/session'

export async function POST (_req: NextRequest) {
  const res = NextResponse.json({ ok: true }, { status: 200 })
  res.headers.set('Set-Cookie', clearSessionCookie())
  return res
}



