import { NextRequest, NextResponse } from 'next/server'
import { normalizePhoneToE164 } from '@/shared/utils/phone'
import { codeTtlSeconds } from '@/shared/server/totp'

export async function POST (req: NextRequest) {
  try {
    const { phone } = (await req.json()) as { phone?: string }
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    // We no longer deliver the code here. Users must get it via the Telegram bot.
    const normalized = normalizePhoneToE164(phone) // kept for UX consistency on client
    const payload: any = {
      ok: true,
      ttl: codeTtlSeconds(),
      delivery: 'telegram_required',
      message: 'Код отправляется только через Telegram-бота. Откройте бота и отправьте контакт.'
    }
    return NextResponse.json(payload, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
