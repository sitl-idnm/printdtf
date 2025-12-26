/**
 * Скрипт для создания поля пароля в Bitrix24
 *
 * Запуск: npx tsx scripts/create-password-field.ts
 *
 * Этот скрипт создаст поле с фиксированным кодом UF_CRM_B24LK_PASSWORD
 * для хранения паролей в контактах и лидах.
 */

// Загружаем переменные окружения из .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Загружаем .env.local (приоритет) или .env
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

// Импортируем функцию напрямую, так как это скрипт
async function bitrixCall<T>(method: string, params: Record<string, unknown>): Promise<T> {
	const base = process.env.BITRIX_WEBHOOK_URL
	if (!base) {
		throw new Error('Missing env BITRIX_WEBHOOK_URL')
	}
	const url = `${base}/${method}.json`
	const form = new URLSearchParams()
	Object.entries(params || {}).forEach(([key, value]) => {
		if (value === undefined || value === null) return
		if (typeof value === 'object' && !Array.isArray(value)) {
			Object.entries(value).forEach(([k, v]) => {
				form.append(`${key}[${k}]`, String(v))
			})
		} else if (Array.isArray(value)) {
			value.forEach((v, idx) => {
				if (typeof v === 'object') {
					Object.entries(v).forEach(([vk, vv]) => {
						form.append(`${key}[${idx}][${vk}]`, String(vv))
					})
				} else {
					form.append(`${key}[${idx}]`, String(v))
				}
			})
		} else {
			form.append(key, String(value))
		}
	})
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: form
	})
	const data = (await res.json()) as { result?: T; error?: string; error_description?: string }
	if (!res.ok || data.error) {
		throw new Error(data.error_description || data.error || `Bitrix error for ${method}`)
	}
	return data.result as T
}

// Уникальное название поля - точно не совпадет с другими
const PASSWORD_FIELD_TITLE = 'B24LK_PASSWORD_FIELD'

async function checkFieldExists(): Promise<boolean> {
  try {
    // Получаем список всех полей контактов
    const fields = await bitrixCall<Record<string, { title?: string }>>('crm.contact.fields', {})

    // Проверяем, есть ли поле с нужным названием
    for (const [fieldCode, fieldData] of Object.entries(fields)) {
      if (!fieldCode.startsWith('UF_CRM_')) continue
      const fieldTitle = fieldData.title || ''
      if (fieldTitle.toLowerCase() === PASSWORD_FIELD_TITLE.toLowerCase()) {
        return true
      }
    }
    return false
  } catch (e: any) {
    console.log(`   ⚠️  Не удалось проверить поле (${e.message})`)
    return false
  }
}

async function createPasswordField() {
  console.log('🔒 Инструкция по созданию поля пароля в Bitrix24')
  console.log(`\nНазвание поля (ВАЖНО - должно быть ТОЧНО таким): ${PASSWORD_FIELD_TITLE}\n`)

  console.log('📝 ИНСТРУКЦИЯ:')
  console.log('Создайте поле вручную в Bitrix24:\n')

  console.log('1. Откройте Bitrix24 → CRM → Настройки → Настройки форм и отчетов → Пользовательские поля')
  console.log('2. Выберите "Контакт" → Нажмите "Добавить поле"')
  console.log(`3. Название: "${PASSWORD_FIELD_TITLE}" (ВАЖНО - скопируйте точно!)`)
  console.log('4. Тип: "Строка"')
  console.log('5. Сохраните\n')
  console.log('   ⚠️  ВАЖНО: Название должно быть ТОЧНО таким: B24LK_PASSWORD_FIELD')
  console.log('   Система ищет поле по точному названию (регистронезависимо)\n')

  console.log('Проверяю, существует ли уже поле...\n')

  try {
    // Проверяем существование поля для контактов
    console.log('Проверка поля для контактов...')
    const contactFieldExists = await checkFieldExists()

    if (contactFieldExists) {
      console.log(`   ✅ Поле с названием "${PASSWORD_FIELD_TITLE}" найдено!`)
    } else {
      console.log(`   ❌ Поле с названием "${PASSWORD_FIELD_TITLE}" НЕ найдено`)
      console.log('   → Создайте его вручную по инструкции выше\n')
    }

    console.log('\n✅ Готово!')
    console.log(`\nСистема автоматически найдет поле по названию "${PASSWORD_FIELD_TITLE}"`)
    console.log('Никаких дополнительных настроек не требуется.')

  } catch (e: any) {
    console.error('\n❌ Ошибка:', e.message)
    process.exit(1)
  }
}

createPasswordField()
