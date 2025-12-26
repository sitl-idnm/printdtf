import { NextRequest, NextResponse } from 'next/server'
import { normalizePhoneToE164, extractDigits } from '@/shared/utils/phone'
import { findContactIdsByPhone, getContactById, getContactPasswordField } from '@/shared/server/bitrix'
import { createSessionToken, buildSessionCookie } from '@/shared/server/session'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = (await req.json()) as { phone?: string; password?: string }
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const normalized = normalizePhoneToE164(phone)
    const digits = extractDigits(normalized)

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt:', {
        inputPhone: phone,
        normalized,
        digits,
        passwordLength: password.length
      })
    }

    // Пробуем разные форматы телефона для поиска
    const phoneVariants = [
      digits, // 79035559873
      digits.startsWith('7') ? digits.slice(1) : digits, // 9035559873 (без 7)
      digits.startsWith('7') ? '8' + digits.slice(1) : '7' + digits, // 89035559873 или 79035559873
    ]

    if (process.env.NODE_ENV === 'development') {
      console.log('Phone variants to search:', phoneVariants)
    }

    // Ищем только контакты (лиды не используем)
    if (process.env.NODE_ENV === 'development') {
      console.log('Searching contacts by phone:', digits)
    }
    let contactIds: string[] = []
    for (const phoneVariant of phoneVariants) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Trying to find contacts with variant: ${phoneVariant}`)
      }
      const found = await findContactIdsByPhone(phoneVariant)
      if (found.length) {
        contactIds.push(...found)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Found contacts with variant ${phoneVariant}:`, found)
        }
        // НЕ останавливаемся - проверяем все варианты, чтобы найти максимум контактов
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`No contacts found with variant: ${phoneVariant}`)
        }
      }
    }

    // Убираем дубликаты
    contactIds = Array.from(new Set(contactIds))

    if (process.env.NODE_ENV === 'development') {
      console.log('All contact IDs found:', contactIds)
      console.log(`Total unique contacts: ${contactIds.length}`)
    }

    if (contactIds.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No contacts found for phone:', digits, 'variants tried:', phoneVariants)
      }
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

    if (contactIds.length) {
      // Сортируем по ID (новые первыми) и проверяем ВСЕ контакты
      // Останавливаемся, как только найдем совпадение пароля
      const sortedContactIds = contactIds
        .map(id => String(id))
        .sort((a, b) => Number(b) - Number(a))
      // Убрали .slice(0, 10) - проверяем все контакты

      if (process.env.NODE_ENV === 'development') {
        console.log(`Checking ${sortedContactIds.length} contacts (all found contacts)`)
        console.log(`Contact IDs to check:`, sortedContactIds)
      }

      for (const contactId of sortedContactIds) {
        const contact = await getContactById(contactId)
        if (!contact) continue

        // Проверяем, что телефон действительно совпадает
        const contactPhones = contact.PHONE || []
        const contactPhoneDigits = contactPhones.map(p => extractDigits(p.VALUE))
        const phoneMatches = contactPhoneDigits.some(cp => {
          // Нормализуем телефон контакта для сравнения
          const normalizedContactPhone = normalizePhoneToE164(cp)
          const contactDigits = extractDigits(normalizedContactPhone)
          return contactDigits === digits ||
                 contactDigits === digits.slice(1) ||
                 '7' + contactDigits === digits ||
                 '8' + contactDigits === digits
        })

        if (!phoneMatches) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Contact ${contactId} phone doesn't match, skipping`)
          }
          continue
        }

        // Передаем пароль для поиска поля по значению
        const trimmedInput = password.trim()
        const storedPassword = await getContactPasswordField(contactId, undefined, trimmedInput)
        // Trim passwords for comparison (remove leading/trailing spaces)
        const trimmedStored = storedPassword?.trim() || ''

        if (process.env.NODE_ENV === 'development') {
          console.log('Password check:', {
            contactId,
            hasStoredPassword: !!storedPassword,
            storedPassword: storedPassword ? `${storedPassword.substring(0, 5)}...` : 'null',
            storedPasswordLength: storedPassword?.length || 0,
            inputPassword: `${trimmedInput.substring(0, 5)}...`,
            inputPasswordLength: trimmedInput.length,
            passwordsMatch: trimmedStored === trimmedInput,
            storedFirstChars: storedPassword?.substring(0, 10),
            inputFirstChars: trimmedInput.substring(0, 10)
          })
        }

        if (trimmedStored && trimmedStored === trimmedInput) {
          const token = createSessionToken({ phone: normalized })
          const res = NextResponse.json({ ok: true, entity: 'contact', contactId }, { status: 200 })
          res.headers.set('Set-Cookie', buildSessionCookie(token))
          return res
        } else {
          // Продолжаем проверять другие контакты
          if (process.env.NODE_ENV === 'development') {
            console.log(`Password mismatch for contact ${contactId}, trying next contact`)
          }
          continue
        }
      }

      // Если дошли сюда, значит ни один контакт не подошел
      return NextResponse.json({
        error: 'Invalid phone or password'
      }, { status: 401 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('No contacts found for digits:', digits)
    }

    return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : 'Unknown error') }, { status: 500 })
  }
}
