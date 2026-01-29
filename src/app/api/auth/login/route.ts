import { NextRequest, NextResponse } from 'next/server'
import { normalizePhoneToE164, extractDigits, formatPhoneWithSpaces } from '@/shared/utils/phone'
import { findContactIdsByPhone, getContactById, getContactPasswordField } from '@/shared/server/bitrix'
import { createSessionToken, buildSessionCookie } from '@/shared/server/session'

export async function POST(req: NextRequest) {
  try {
    console.log('🔐 ========== LOGIN REQUEST START ==========')
    const { phone, password } = (await req.json()) as { phone?: string; password?: string }

    console.log('📞 Login attempt received:', {
      inputPhone: phone,
      passwordLength: password?.length || 0,
      hasPassword: !!password
    })

    if (!phone) {
      console.log('❌ Phone is required')
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    if (!password) {
      console.log('❌ Password is required')
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const normalized = normalizePhoneToE164(phone)
    const digits = extractDigits(normalized)

    console.log('📱 Phone normalization:', {
      inputPhone: phone,
      normalized,
      digits,
      passwordLength: password.length
    })

    // Пробуем разные форматы телефона для поиска
    // В Bitrix24 телефон хранится с +7, поэтому добавляем варианты с плюсом
    const formattedWithSpaces = formatPhoneWithSpaces(digits) // +7 903 744-76-81
    const phoneVariants = [
      formattedWithSpaces, // +7 903 744-76-81 (форматированный вариант)
      '+' + digits, // +79035559873 (основной формат в Bitrix24)
      digits, // 79035559873
      digits.startsWith('7') ? digits.slice(1) : digits, // 9035559873 (без 7)
      digits.startsWith('7') ? '8' + digits.slice(1) : '7' + digits, // 89035559873 или 79035559873
    ].filter(Boolean) // Убираем пустые значения

    console.log('🔍 Phone variants to search:', phoneVariants)

    // Ищем только контакты (лиды не используем)
    console.log('🔎 Searching contacts by phone:', digits)
    let contactIds: string[] = []
    for (const phoneVariant of phoneVariants) {
      console.log(`  → Trying variant: ${phoneVariant}`)
      const found = await findContactIdsByPhone(phoneVariant)
      if (found.length) {
        contactIds.push(...found)
        console.log(`  ✅ Found ${found.length} contacts with variant ${phoneVariant}:`, found)
        // НЕ останавливаемся - проверяем все варианты, чтобы найти максимум контактов
      } else {
        console.log(`  ❌ No contacts found with variant: ${phoneVariant}`)
      }
    }

    // Убираем дубликаты
    contactIds = Array.from(new Set(contactIds))

    console.log('📋 All contact IDs found:', contactIds)
    console.log(`📊 Total unique contacts: ${contactIds.length}`)

    if (contactIds.length === 0) {
      console.log('❌ No contacts found for phone:', digits, 'variants tried:', phoneVariants)
      console.log('🔐 ========== LOGIN REQUEST END (NO CONTACTS) ==========')
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

    if (contactIds.length) {
      // Сортируем по ID (новые первыми) и проверяем ВСЕ контакты
      // Останавливаемся, как только найдем совпадение пароля
      const sortedContactIds = contactIds
        .map(id => String(id))
        .sort((a, b) => Number(b) - Number(a))
      // Убрали .slice(0, 10) - проверяем все контакты

      console.log(`👥 Checking ${sortedContactIds.length} contacts (all found contacts)`)
      console.log(`📝 Contact IDs to check:`, sortedContactIds)

      for (const contactId of sortedContactIds) {
        console.log(`\n👤 Checking contact ID: ${contactId}`)
        const contact = await getContactById(contactId)
        if (!contact) {
          console.log(`  ❌ Contact ${contactId} not found, skipping`)
          continue
        }

        // Проверяем, что телефон действительно совпадает
        const contactPhones = contact.PHONE || []
        const contactPhoneDigits = contactPhones.map(p => extractDigits(p.VALUE))
        const contactName = `${contact.NAME || ''} ${contact.LAST_NAME || ''}`.trim() || 'N/A'

        console.log(`  📞 Phone matching for contact ${contactId} (${contactName}):`, {
          inputDigits: digits,
          contactPhones: contactPhones.map(p => p.VALUE),
          contactPhoneDigits
        })

        const phoneMatches = contactPhoneDigits.some(cp => {
          // В Bitrix24 телефон может быть в формате +7XXXXXXXXXX
          // Сначала проверяем исходное значение контакта (может быть с +7)
          const contactPhoneOriginal = cp
          const contactPhoneWithPlus = contactPhoneOriginal.startsWith('+')
            ? contactPhoneOriginal
            : '+' + contactPhoneOriginal

          // Нормализуем телефон контакта для сравнения
          const normalizedContactPhone = normalizePhoneToE164(cp)
          const contactDigits = extractDigits(normalizedContactPhone)

          // Создаем нормализованный вариант ввода с +7
          const inputWithPlus = '+' + digits
          const inputDigitsOnly = digits

          // Сравниваем разные варианты:
          // 1. Оригинальный телефон контакта (может быть +7XXXXXXXXXX) с +7 + digits
          // 2. Цифры контакта с цифрами ввода
          // 3. Различные комбинации с/без 7 и 8
          const matches =
            contactPhoneWithPlus === inputWithPlus || // +7XXXXXXXXXX === +7XXXXXXXXXX
            contactPhoneOriginal === inputWithPlus || // 7XXXXXXXXXX === +7XXXXXXXXXX (если в Bitrix без +)
            contactDigits === inputDigitsOnly || // 79035559873 === 79035559873
            contactDigits === inputDigitsOnly.slice(1) || // 9035559873 === 9035559873
            '7' + contactDigits === inputDigitsOnly || // 7 + 9035559873 === 79035559873
            '8' + contactDigits === inputDigitsOnly || // 8 + 9035559873 === 89035559873
            contactPhoneOriginal === inputDigitsOnly || // 79035559873 === 79035559873
            contactPhoneWithPlus === inputDigitsOnly // +79035559873 === 79035559873 (необычно, но проверим)

          if (matches) {
            console.log(`  ✅ Phone match found:`, {
              contactPhoneOriginal: cp,
              contactPhoneWithPlus,
              normalizedContactPhone,
              contactDigits,
              inputDigits: inputDigitsOnly,
              inputWithPlus,
              matchType: contactPhoneWithPlus === inputWithPlus ? 'plus-format' :
                        contactPhoneOriginal === inputWithPlus ? 'original-to-plus' :
                        contactDigits === inputDigitsOnly ? 'exact-digits' :
                        contactDigits === inputDigitsOnly.slice(1) ? 'without-7' :
                        '7+' + contactDigits === inputDigitsOnly ? 'with-7' : 'other'
            })
          }

          return matches
        })

        if (!phoneMatches) {
          const inputWithPlus = '+' + digits
          console.log(`  ❌ Contact ${contactId} phone doesn't match, skipping. Details:`, {
            contactId,
            contactName,
            contactPhones: contactPhones.map(p => p.VALUE),
            contactPhoneDigits,
            inputDigits: digits,
            inputWithPlus,
            comparison: contactPhoneDigits.map(cp => {
              const contactPhoneWithPlus = cp.startsWith('+') ? cp : '+' + cp
              const normalizedContactPhone = normalizePhoneToE164(cp)
              const contactDigits = extractDigits(normalizedContactPhone)
              return {
                contactPhoneOriginal: cp,
                contactPhoneWithPlus,
                contactDigits,
                inputDigits: digits,
                inputWithPlus,
                plusFormat: contactPhoneWithPlus === inputWithPlus,
                originalToPlus: cp === inputWithPlus,
                exactDigits: contactDigits === digits,
                without7: contactDigits === digits.slice(1),
                with7: '7' + contactDigits === digits,
                with8: '8' + contactDigits === digits
              }
            })
          })
          continue
        }

        // Получаем пароль из поля UF_CRM_B24LK_CONTACT_PIN
        console.log(`  🔑 Checking password for contact ${contactId}`)
        const trimmedInput = password.trim()
        const storedPassword = await getContactPasswordField(contactId, 'UF_CRM_B24LK_CONTACT_PIN', trimmedInput)
        // Trim passwords for comparison (remove leading/trailing spaces)
        const trimmedStored = storedPassword || ''

        console.log('  🔐 Final password comparison:', {
          contactId,
          contactName,
          hasStoredPassword: !!storedPassword,
          storedPassword: storedPassword ? `"${storedPassword}"` : 'null',
          storedPasswordLength: storedPassword?.length || 0,
          inputPassword: `"${trimmedInput}"`,
          inputPasswordLength: trimmedInput.length,
          passwordsMatch: trimmedStored === trimmedInput,
          storedFirstChars: storedPassword?.substring(0, 20),
          inputFirstChars: trimmedInput.substring(0, 20),
          storedCharCodes: storedPassword?.split('').map(c => c.charCodeAt(0)).slice(0, 10),
          inputCharCodes: trimmedInput.split('').map(c => c.charCodeAt(0)).slice(0, 10)
        })

        // Строгое сравнение паролей (учитываем регистр и все символы)
        if (trimmedStored && trimmedStored === trimmedInput) {
          console.log(`  ✅ SUCCESS! Password matches for contact ${contactId}`)
          console.log('🔐 ========== LOGIN REQUEST END (SUCCESS) ==========')
          const token = createSessionToken({ phone: normalized })
          const res = NextResponse.json({ ok: true, entity: 'contact', contactId }, { status: 200 })
          res.headers.set('Set-Cookie', buildSessionCookie(token))
          return res
        } else {
          // Продолжаем проверять другие контакты
          console.log(`  ❌ Password mismatch for contact ${contactId}, trying next contact`)
          continue
        }
      }

      // Если дошли сюда, значит ни один контакт не подошел
      console.log('❌ No contacts matched phone and password')
      console.log('🔐 ========== LOGIN REQUEST END (NO MATCH) ==========')
      return NextResponse.json({
        error: 'Invalid phone or password'
      }, { status: 401 })
    }

    console.log('❌ No contacts found for digits:', digits)
    console.log('🔐 ========== LOGIN REQUEST END (NO CONTACTS) ==========')
    return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
  } catch (e: unknown) {
    console.error('❌ ERROR in login:', e)
    console.log('🔐 ========== LOGIN REQUEST END (ERROR) ==========')
    return NextResponse.json({ error: (e instanceof Error ? e.message : 'Unknown error') }, { status: 500 })
  }
}
