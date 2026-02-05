
import { formatPhoneWithSpaces } from '@/shared/utils/phone'

type BitrixCommonResponse<T> = {
	result?: T
	time?: unknown
	total?: number
	next?: number
	error?: string
	error_description?: string
}

export type BitrixLead = {
	ID: string
	TITLE?: string
	NAME?: string
	LAST_NAME?: string
	SECOND_NAME?: string
	STATUS_ID?: string
	STATUS_DESCRIPTION?: string
	ASSIGNED_BY_ID?: string
	PHONE?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	EMAIL?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	COMMENTS?: string
	DATE_CREATE?: string
	DATE_MODIFY?: string
	SOURCE_ID?: string
	OPPORTUNITY?: string
	CURRENCY_ID?: string
}

export type BitrixContact = {
	ID: string
	NAME?: string
	LAST_NAME?: string
	SECOND_NAME?: string
	POST?: string
	COMPANY_ID?: string
	ASSIGNED_BY_ID?: string
	TYPE_ID?: string
	SOURCE_ID?: string
	COMMENTS?: string
	PHONE?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	EMAIL?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	DATE_CREATE?: string
	DATE_MODIFY?: string
}

export async function bitrixCall<T>(method: string, params: Record<string, unknown>): Promise<T> {
	const base = process.env.BITRIX_WEBHOOK_URL
	if (!base) {
		throw new Error('Missing env BITRIX_WEBHOOK_URL')
	}
	const url = `${base}/${method}.json`
	const form = new URLSearchParams()

	const appendParam = (prefix: string, value: unknown) => {
		if (value === undefined || value === null) return
		if (Array.isArray(value)) {
			value.forEach((v, idx) => appendParam(`${prefix}[${idx}]`, v))
			return
		}
		if (typeof value === 'object') {
			Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
				appendParam(`${prefix}[${k}]`, v)
			})
			return
		}
		form.append(prefix, String(value))
	}

	Object.entries(params || {}).forEach(([key, value]) => {
		appendParam(key, value)
	})
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: form
	})
	const data = (await res.json()) as BitrixCommonResponse<T>
	if (!res.ok || data.error) {
		throw new Error(data.error_description || data.error || `Bitrix error for ${method}`)
	}
	return data.result as T
}

export async function findLeadIdsByPhone(phoneDigits: string): Promise<string[]> {
	type DupResp = {
		LEAD?: string[]
	}
	const result = await bitrixCall<DupResp>('crm.duplicate.findbycomm', {
		type: 'PHONE',
		values: [phoneDigits]
	})
	return result?.LEAD || []
}

export async function getLeadById(id: string): Promise<BitrixLead | null> {
	// Получаем все поля лида (без select - вернёт все поля)
	const lead = await bitrixCall<Record<string, unknown>>('crm.lead.get', { id })
	return lead as BitrixLead | null
}

// Получить код поля по названию для контактов
// УБРАЛИ ГЛОБАЛЬНЫЙ КЭШ - он мешал для разных контактов
// Теперь ищем поле для каждого контакта отдельно

export async function getLeadPasswordField(id: string, fieldName?: string): Promise<string | null> {
	if (process.env.NODE_ENV === 'development') {
		console.log('getLeadPasswordField called:', { leadId: id, fieldName })
	}

	// Используем конкретное поле для всех лидов
	// Приоритет: 1) параметр fieldName, 2) переменная окружения, 3) стандартное поле UF_CRM_B24LK_PASSWORD
	const field = fieldName || process.env.BITRIX_PASSWORD_FIELD || 'UF_CRM_B24LK_PASSWORD'

	if (process.env.NODE_ENV === 'development') {
		console.log('Using password field:', field)
	}

	// Получаем данные лида
	let lead: Record<string, unknown>
	try {
		lead = await bitrixCall<Record<string, unknown>>('crm.lead.get', { id })
		if (process.env.NODE_ENV === 'development') {
			const passwordValue = lead[field]
			console.log(`Lead ${id} password field ${field}:`, {
				hasValue: !!passwordValue,
				value: passwordValue ? String(passwordValue).substring(0, 20) : 'empty'
			})
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting lead:', e)
		}
		return null
	}

	// Просто возвращаем значение из указанного поля
	const passwordValue = lead[field]
	if (process.env.NODE_ENV === 'development') {
		console.log('Getting lead password by field code:', {
			leadId: id,
			fieldCode: field,
			hasValue: !!passwordValue,
			value: passwordValue ? String(passwordValue).substring(0, 10) + '...' : 'null'
		})
	}
	return passwordValue ? String(passwordValue).trim() : null
}


export async function getContactPasswordField(id: string, fieldName?: string, inputPassword?: string): Promise<string | null> {
	console.log('  🔍 getContactPasswordField called:', { contactId: id, fieldName, hasInputPassword: !!inputPassword })

	// Используем конкретное поле UF_CRM_B24LK_CONTACT_PIN для проверки пароля
	const passwordField = fieldName || 'UF_CRM_B24LK_CONTACT_PIN'

	// Получаем данные контакта
	let contact: Record<string, unknown>
	try {
		contact = await bitrixCall<Record<string, unknown>>('crm.contact.get', { id })
	} catch (e) {
		console.error('  ❌ Error getting contact:', e)
		return null
	}

	// Проверяем, существует ли поле в контакте
	const hasField = passwordField in contact
	const passwordValue = contact[passwordField]

	// Обрабатываем разные типы значений (число, строка, null, undefined)
	let trimmedPassword: string | null = null
	if (passwordValue !== null && passwordValue !== undefined) {
		// Преобразуем в строку и убираем пробелы
		trimmedPassword = String(passwordValue).trim()
		// Если после trim осталась пустая строка, считаем null
		if (trimmedPassword === '') {
			trimmedPassword = null
		}
	}

	console.log('  🔑 Password check:', {
		contactId: id,
		fieldCode: passwordField,
		fieldExists: hasField,
		rawValue: passwordValue,
		valueType: typeof passwordValue,
		hasValue: !!passwordValue,
		trimmedValue: trimmedPassword ? `"${trimmedPassword}"` : 'null',
		trimmedValueLength: trimmedPassword?.length || 0,
		inputPassword: inputPassword ? `"${inputPassword.trim()}"` : 'not provided',
		inputPasswordLength: inputPassword?.trim().length || 0,
		willMatch: trimmedPassword === inputPassword?.trim()
	})

	// Дополнительная диагностика: показываем все UF_CRM_ поля для отладки
	const ufFields = Object.entries(contact)
		.filter(([key]) => key.startsWith('UF_CRM_'))
		.map(([key, value]) => ({ key, value: String(value).substring(0, 30), type: typeof value }))
	console.log('  📋 All UF_CRM_ fields in contact:', ufFields)

	return trimmedPassword
}

export async function findContactIdsByPhone(phoneDigits: string): Promise<string[]> {
	type DupResp = {
		CONTACT?: string[]
	}

	type ContactListResp = {
		result?: Array<{ ID: string }>
		next?: number
		total?: number
	}

	console.log('🔍 Searching contacts by phone digits:', phoneDigits)

	const allContactIds = new Set<string>()

	// МЕТОД 1: Используем duplicate.findbycomm с разными вариантами формата телефона
	// В Bitrix24 телефон хранится с +7, поэтому приоритет отдаем формату с плюсом
	const formattedWithSpaces = formatPhoneWithSpaces(phoneDigits) // +7 903 744-76-81

	const phoneVariantsForDuplicate = [
		formattedWithSpaces, // +7 903 744-76-81 (форматированный вариант - ПРИОРИТЕТ)
		'+' + phoneDigits, // +79035559873 (формат в Bitrix24)
		phoneDigits.startsWith('+') ? phoneDigits : '+' + phoneDigits, // +79035559873 (если уже есть +)
		phoneDigits, // 79035559873
		phoneDigits.startsWith('7') ? phoneDigits.slice(1) : phoneDigits, // 9035559873
		phoneDigits.startsWith('7') ? '8' + phoneDigits.slice(1) : '7' + phoneDigits, // 89035559873
		phoneDigits.startsWith('8') ? '7' + phoneDigits.slice(1) : phoneDigits, // 79035559873
		phoneDigits.startsWith('+') ? phoneDigits.slice(1) : phoneDigits, // 79035559873 (убираем + если есть)
	].filter(Boolean) // Убираем пустые значения

	// Убираем дубликаты вариантов
	const uniqueVariants = Array.from(new Set(phoneVariantsForDuplicate))

	console.log('🔍 Searching contacts with phone variants (Bitrix24 format +7 priority):', uniqueVariants)

	for (const variant of uniqueVariants) {
		try {
			const result = await bitrixCall<DupResp>('crm.duplicate.findbycomm', {
				type: 'PHONE',
				values: [variant]
			})
			const contactIds = result?.CONTACT || []
			contactIds.forEach(id => allContactIds.add(String(id)))

			if (contactIds.length > 0) {
				console.log(`  ✅ duplicate.findbycomm found ${contactIds.length} contacts with variant "${variant}"`)
			} else {
				console.log(`  ❌ No contacts found with variant "${variant}"`)
			}
		} catch (e) {
			console.error(`  ❌ Error with duplicate.findbycomm for variant "${variant}":`, e)
		}
	}

	console.log(`📊 duplicate.findbycomm total unique contacts: ${allContactIds.size}`)

	// МЕТОД 2: Используем crm.contact.list с фильтром по телефону (дополнительный поиск)
	// Используем только если duplicate.findbycomm не нашел контакты, чтобы не делать лишние запросы
	if (allContactIds.size === 0) {
		// Пробуем только основные варианты телефона
		const mainVariants = [
			phoneDigits, // 79035559873
			phoneDigits.startsWith('7') ? phoneDigits.slice(1) : phoneDigits, // 9035559873
		]

		for (const variant of mainVariants) {
			try {
				// Используем только один фильтр - частичное совпадение
				const result = await bitrixCall<ContactListResp>('crm.contact.list', {
					filter: { '%PHONE': variant },
					select: ['ID']
				})

				const contacts = result?.result || []
				const foundIds = contacts.map(c => String(c.ID))
				foundIds.forEach(id => allContactIds.add(id))

				// Если нашли контакты, проверяем следующую страницу (только одну)
				if (result?.next && contacts.length > 0) {
					try {
						const nextResult: ContactListResp = await bitrixCall<ContactListResp>('crm.contact.list', {
							filter: { '%PHONE': variant },
							select: ['ID'],
							start: result.next
						})
						const nextContacts = nextResult?.result || []
						const nextIds = nextContacts.map((contact: { ID: string }) => String(contact.ID))
						nextIds.forEach(id => allContactIds.add(id))
					} catch (e) {
						// Игнорируем ошибки пагинации
					}
				}

				// Если нашли контакты, прекращаем поиск
				if (allContactIds.size > 0) {
					break
				}
			} catch (e) {
				// Игнорируем ошибки, продолжаем поиск
			}
		}
	}


	const finalContactIds = Array.from(allContactIds)

	if (process.env.NODE_ENV === 'development') {
		console.log(`Total unique contacts found: ${finalContactIds.length}`, finalContactIds)
	}

	return finalContactIds
}

export async function getContactById(id: string): Promise<BitrixContact | null> {
	// Получаем все поля контакта (без select - вернёт все поля)
	const contact = await bitrixCall<Record<string, unknown>>('crm.contact.get', { id })
	return contact as BitrixContact | null
}

export type BitrixCompany = {
	ID: string
	TITLE?: string
	COMPANY_TYPE?: string
	INDUSTRY?: string
	ASSIGNED_BY_ID?: string
	COMMENTS?: string
	PHONE?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	EMAIL?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
	DATE_CREATE?: string
	DATE_MODIFY?: string
}

export type BitrixDeal = {
	ID: string
	TITLE?: string
	STAGE_ID?: string
	CATEGORY_ID?: string
	ASSIGNED_BY_ID?: string
	CONTACT_ID?: string
	COMPANY_ID?: string
	OPPORTUNITY?: string
	CURRENCY_ID?: string
	DATE_CREATE?: string
	DATE_MODIFY?: string
	[key: string]: unknown // Все остальные поля
}

export type BitrixDiskFile = {
	ID: string
	NAME?: string
	SIZE?: number
	DOWNLOAD_URL?: string
	DETAIL_URL?: string
	CONTENT_TYPE?: string
	// Bitrix sometimes returns nested data
	NAME_FILE?: string
	OBJECT_ID?: string | number
}

export type BitrixDiskAttachedObject = {
	ID: string
	OBJECT_ID?: string | number // actual file ID on disk
	NAME?: string
	// some portals return FILE_NAME or NAME_FILE, keep flexible
	FILE_NAME?: string
	NAME_FILE?: string
}

export async function getCompanyById(id: string): Promise<BitrixCompany | null> {
	// Получаем все поля компании (без select - вернёт все поля)
	const company = await bitrixCall<Record<string, unknown>>('crm.company.get', { id })
	return company as BitrixCompany | null
}

export async function listDealsByContactId(contactId: string): Promise<BitrixDeal[]> {
	console.log(`\n🔍 ========== listDealsByContactId START ==========`)
	console.log(`🔍 Searching deals for contact ID: ${contactId} (type: ${typeof contactId})`)

	// Получаем все поля сделок (без select - вернёт все поля)
	try {
		console.log(`   Calling crm.deal.list with filter: { CONTACT_ID: "${contactId}" }`)
		const deals = await bitrixCall<BitrixDeal[]>('crm.deal.list', {
			filter: { CONTACT_ID: contactId },
			order: { ID: 'DESC' },
			// ВАЖНО: тянем пользовательские поля
			select: ['*', 'UF_*']
		})

		console.log(`✅ Found ${deals?.length || 0} deals for contact ${contactId}`)
		if (deals && deals.length > 0) {
			console.log(`   Deal IDs:`, deals.map(d => d.ID))
			console.log(`   Deal details:`, deals.map(d => ({
				id: d.ID,
				title: d.TITLE,
				contactId: d.CONTACT_ID,
				contactIdType: typeof d.CONTACT_ID,
				companyId: d.COMPANY_ID
			})))
		} else {
			console.log(`   ⚠️  No deals found with filter CONTACT_ID="${contactId}"`)
		}

		console.log(`🔍 ========== listDealsByContactId END ==========\n`)
		return deals || []
	} catch (e) {
		console.error(`❌ Error getting deals for contact ${contactId}:`, e)
		console.error(`   Error details:`, e instanceof Error ? e.message : String(e))

		// Пробуем альтернативный способ - получить сделки через фильтр с разными вариантами
		try {
			console.log(`   Trying alternative method with string contactId...`)
			const dealsAlt = await bitrixCall<BitrixDeal[]>('crm.deal.list', {
				filter: { 'CONTACT_ID': String(contactId) },
				order: { ID: 'DESC' },
				select: ['*', 'UF_*']
			})

			console.log(`✅ Alternative method found ${dealsAlt?.length || 0} deals for contact ${contactId}`)
			console.log(`🔍 ========== listDealsByContactId END (alternative) ==========\n`)

			return dealsAlt || []
		} catch (e2) {
			console.error(`❌ Alternative method also failed for contact ${contactId}:`, e2)
			console.error(`   Error details:`, e2 instanceof Error ? e2.message : String(e2))
			console.log(`🔍 ========== listDealsByContactId END (error) ==========\n`)
			return []
		}
	}
}

export async function listLeadsByContactId(contactId: string): Promise<BitrixLead[]> {
	try {
		// Получаем все поля лидов (без select - вернёт все поля)
		const leads = await bitrixCall<BitrixLead[]>('crm.lead.list', {
			filter: { CONTACT_ID: contactId },
			order: { ID: 'DESC' }
		})
		return leads || []
	} catch {
		return []
	}
}

export async function listDealsByCompanyId(companyId: string): Promise<BitrixDeal[]> {
	// Получаем все поля сделок (без select - вернёт все поля)
	const deals = await bitrixCall<BitrixDeal[]>('crm.deal.list', {
		filter: { COMPANY_ID: companyId },
		order: { ID: 'DESC' },
		select: ['*', 'UF_*']
	})
	return deals || []
}

export async function getDealById(id: string): Promise<BitrixDeal | null> {
	const deal = await bitrixCall<BitrixDeal>('crm.deal.get', { id })
	return deal || null
}

/**
 * Получить метаданные файла Диска Битрикс по ID (для формирования ссылки загрузки)
 */
export async function getDiskFileMeta(id: string): Promise<BitrixDiskFile | null> {
	try {
		const file = await bitrixCall<BitrixDiskFile>('disk.file.get', { id })
		return file || null
	} catch {
		return null
	}
}

export async function getDiskAttachedMeta(id: string): Promise<BitrixDiskAttachedObject | null> {
	try {
		const obj = await bitrixCall<BitrixDiskAttachedObject>('disk.attachedObject.get', { id })
		return obj || null
	} catch {
		return null
	}
}
