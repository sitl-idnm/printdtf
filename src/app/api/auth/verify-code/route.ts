import { NextRequest, NextResponse } from 'next/server'
import { normalizePhoneToE164 } from '@/shared/utils/phone'
import { verifyCode } from '@/shared/server/totp'
import { buildSessionCookie, createSessionToken } from '@/shared/server/session'

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = (await req.json()) as { phone?: string; code?: string }
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 })
    }
    const normalized = normalizePhoneToE164(phone)
    const ok = verifyCode(normalized, code)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }
    const token = createSessionToken({ phone: normalized, exp: 0 /* set inside creator */ })
    const res = NextResponse.json({ ok: true }, { status: 200 })
    res.headers.set('Set-Cookie', buildSessionCookie(token))
    return res
  } catch (e: unknown) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : 'Unknown error') }, { status: 500 })
  }
}
