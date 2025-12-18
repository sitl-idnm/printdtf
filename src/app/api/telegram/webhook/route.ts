import { NextRequest, NextResponse } from 'next/server'
import { extractDigits } from '@/shared/utils/phone'
import { findLeadIdsByPhone } from '@/shared/server/bitrix'
import { tgSendMessage } from '@/shared/server/telegram'
import { generateCode } from '@/shared/server/totp'
import { normalizePhoneToE164 } from '@/shared/utils/phone'

type TgUpdate = {
  update_id: number
  message?: {
    message_id: number
    date: number
    chat: { id: number; type: string; username?: string; first_name?: string; last_name?: string }
    text?: string
    contact?: { phone_number: string; user_id: number; first_name?: string; last_name?: string }
  }
}

export async function POST (req: NextRequest) {
  try {
    const update = (await req.json()) as TgUpdate
    const msg = update.message
    if (!msg) return NextResponse.json({ ok: true })

    // Handle contact sharing to pair phone -> chatId
    if (msg.contact?.phone_number) {
      const chatId = msg.chat.id
      const normalized = normalizePhoneToE164(msg.contact.phone_number)
      const digits = extractDigits(normalized)
      const leadIds = await findLeadIdsByPhone(digits)
      if (leadIds.length) {
        const code = generateCode(normalized)
        await tgSendMessage(chatId, [
          '✅ Привязка выполнена.',
          '',
          'Ваш код для входа:',
          `<b>${code}</b>`,
          '',
          'Перейдите на сайт и введите код на странице входа.'
        ].join('\n'))
      } else {
        await tgSendMessage(msg.chat.id, '⚠️ Не нашли лид с таким номером в CRM. Проверьте номер телефона.')
      }
      return NextResponse.json({ ok: true })
    }

    // Default response
    if (msg.text === '/start') {
      await tgSendMessage(msg.chat.id, 'Привет! Нажмите кнопку «Отправить номер телефона» в меню, чтобы привязать ваш номер.')
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: true })
  }
}


