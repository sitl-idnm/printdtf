
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

// Уникальное название поля пароля - точно не совпадет с другими полями
const PASSWORD_FIELD_TITLE = 'B24LK_PASSWORD_FIELD'

// Кэш для кода поля пароля (находим один раз по названию)
let contactPasswordFieldCode: string | null = null

async function findPasswordFieldCode(): Promise<string | null> {
	// Если уже нашли, возвращаем из кэша
	if (contactPasswordFieldCode) {
		return contactPasswordFieldCode
	}

	// ПРИОРИТЕТ 1: Ищем поле по ТОЧНОМУ названию (это главный способ)
	let fields: Record<string, { title?: string; type?: string }> | null = null
	try {
		fields = await bitrixCall<Record<string, { title?: string; type?: string }>>('crm.contact.fields', {})

		if (process.env.NODE_ENV === 'development') {
			const ufFields = Object.entries(fields)
				.filter(([code]) => code.startsWith('UF_CRM_'))
				.map(([code, data]) => ({ code, title: data.title }))
			console.log('Searching for password field by exact title:', {
				searchTitle: PASSWORD_FIELD_TITLE,
				foundUfFields: ufFields
			})
		}

		// Ищем поле с ТОЧНЫМ названием (регистронезависимо)
		for (const [fieldCode, fieldData] of Object.entries(fields)) {
			if (!fieldCode.startsWith('UF_CRM_')) continue

			const fieldTitle = fieldData.title || ''

			// Точное совпадение названия (регистронезависимо)
			if (fieldTitle.toLowerCase() === PASSWORD_FIELD_TITLE.toLowerCase()) {
				contactPasswordFieldCode = fieldCode
				if (process.env.NODE_ENV === 'development') {
					console.log('✅ Found password field by exact title:', { code: fieldCode, title: fieldTitle })
				}
				return fieldCode
			}
		}

		if (process.env.NODE_ENV === 'development') {
			console.log(`❌ Password field with title "${PASSWORD_FIELD_TITLE}" not found`)
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error finding password field by title:', e)
		}
	}

	// ПРИОРИТЕТ 2: Если не нашли по названию, пробуем альтернативные варианты
	// Проверяем известные поля, которые могут содержать пароль
	if (fields) {
		const alternativeFields = [
			'UF_CRM_B24LK_CONTACT_PIN', // Возможно, это поле для пароля
			process.env.BITRIX_PASSWORD_FIELD // Из переменной окружения
		].filter(Boolean) as string[]

		for (const altField of alternativeFields) {
			if (!altField) continue
			// Проверяем, существует ли это поле в списке полей
			const fieldExists = Object.keys(fields).includes(altField)
			if (fieldExists) {
				contactPasswordFieldCode = altField
				if (process.env.NODE_ENV === 'development') {
					console.log('⚠️  Using alternative password field:', altField)
				}
				return altField
			}
		}
	}

	// ПРИОРИТЕТ 3: Если ничего не нашли, используем переменную окружения напрямую (даже если поле не существует)
	if (process.env.BITRIX_PASSWORD_FIELD) {
		contactPasswordFieldCode = process.env.BITRIX_PASSWORD_FIELD
		if (process.env.NODE_ENV === 'development') {
			console.log('⚠️  Using password field from env (final fallback):', contactPasswordFieldCode)
		}
		return contactPasswordFieldCode
	}

	return null
}

export async function getContactPasswordField(id: string, fieldName?: string, inputPassword?: string): Promise<string | null> {
	if (process.env.NODE_ENV === 'development') {
		console.log('getContactPasswordField called:', { contactId: id, fieldName, hasInputPassword: !!inputPassword })
	}

	// Если указан явно, используем его
	if (fieldName) {
		const contact = await bitrixCall<Record<string, unknown>>('crm.contact.get', { id }).catch(() => null)
		if (!contact) return null
		const passwordValue = contact[fieldName]
		return passwordValue ? String(passwordValue).trim() : null
	}

	// Получаем данные контакта
	let contact: Record<string, unknown>
	try {
		contact = await bitrixCall<Record<string, unknown>>('crm.contact.get', { id })
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting contact:', e)
		}
		return null
	}

	// НОВЫЙ ПОДХОД: Ищем поле по ЗНАЧЕНИЮ (если передан пароль)
	if (inputPassword) {
		const trimmedInput = inputPassword.trim()
		const excludedFields = ['UF_CRM_B24LK_CONTACT_ACTIVE_LK', 'ACTIVE_LK']

		if (process.env.NODE_ENV === 'development') {
			console.log(`🔍 Searching for password field by value matching "${trimmedInput}" (length: ${trimmedInput.length})`)
		}

		// Собираем все UF_CRM_ поля для логирования
		const ufFields: Array<{ key: string; value: string; matches: boolean }> = []

		// Ищем все UF_CRM_ поля и сравниваем их значения с введенным паролем
		for (const [key, value] of Object.entries(contact)) {
			if (!key.startsWith('UF_CRM_')) continue
			if (excludedFields.includes(key)) continue

			const strValue = String(value || '').trim()
			// Пропускаем пустые, "0", "false"
			if (!strValue || strValue === '0' || strValue === 'false') {
				if (process.env.NODE_ENV === 'development') {
					ufFields.push({ key, value: strValue || '(empty)', matches: false })
				}
				continue
			}

			const matches = strValue === trimmedInput
			if (process.env.NODE_ENV === 'development') {
				ufFields.push({
					key,
					value: strValue.length > 20 ? strValue.substring(0, 20) + '...' : strValue,
					matches
				})
				// Детальное логирование для отладки
				if (strValue.length > 0 && trimmedInput.length > 0) {
					console.log(`   Comparing field ${key}: "${strValue}" (len: ${strValue.length}) vs "${trimmedInput}" (len: ${trimmedInput.length}) - match: ${matches}`)
				}
			}

			// Сравниваем значение поля с введенным паролем
			if (matches) {
				if (process.env.NODE_ENV === 'development') {
					console.log(`✅ Found password field by value match: ${key} = "${strValue}"`)
					console.log(`   All checked fields:`, ufFields)
				}
				return strValue
			}
		}

		if (process.env.NODE_ENV === 'development') {
			console.log(`❌ No field found with value matching input password`)
			console.log(`   Input password: "${trimmedInput}" (length: ${trimmedInput.length})`)
			console.log(`   All checked fields:`, ufFields)
		}
		return null
	}

	// СТАРЫЙ ПОДХОД (fallback): Ищем поле по названию, если пароль не передан
	const field = await findPasswordFieldCode()
	if (!field) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Password field not found by title:', PASSWORD_FIELD_TITLE)
		}
		return null
	}

	if (process.env.NODE_ENV === 'development') {
		console.log('Using password field:', field)
	}

	const passwordValue = contact[field]
	if (process.env.NODE_ENV === 'development') {
		console.log('Getting contact password by field code:', {
			contactId: id,
			fieldCode: field,
			hasValue: !!passwordValue,
			value: passwordValue ? String(passwordValue).substring(0, 10) + '...' : 'null'
		})
	}
	return passwordValue ? String(passwordValue).trim() : null
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

	if (process.env.NODE_ENV === 'development') {
		console.log('Searching contacts by phone digits:', phoneDigits)
	}

	const allContactIds = new Set<string>()

	// МЕТОД 1: Используем duplicate.findbycomm с разными вариантами формата телефона
	// Пробуем все возможные варианты, чтобы найти максимум контактов
	const phoneVariantsForDuplicate = [
		phoneDigits, // 79035559873
		phoneDigits.startsWith('7') ? phoneDigits.slice(1) : phoneDigits, // 9035559873
		phoneDigits.startsWith('7') ? '8' + phoneDigits.slice(1) : '7' + phoneDigits, // 89035559873
		phoneDigits.startsWith('8') ? '7' + phoneDigits.slice(1) : phoneDigits, // 79035559873
		'+' + phoneDigits, // +79035559873
		phoneDigits.startsWith('+') ? phoneDigits.slice(1) : '+' + phoneDigits, // +79035559873 или 79035559873
	]

	// Убираем дубликаты вариантов
	const uniqueVariants = Array.from(new Set(phoneVariantsForDuplicate))

	for (const variant of uniqueVariants) {
		try {
			const result = await bitrixCall<DupResp>('crm.duplicate.findbycomm', {
				type: 'PHONE',
				values: [variant]
			})
			const contactIds = result?.CONTACT || []
			contactIds.forEach(id => allContactIds.add(String(id)))

			if (process.env.NODE_ENV === 'development' && contactIds.length > 0) {
				console.log(`duplicate.findbycomm found ${contactIds.length} contacts with variant "${variant}"`)
			}
		} catch (e) {
			if (process.env.NODE_ENV === 'development') {
				console.error(`Error with duplicate.findbycomm for variant "${variant}":`, e)
			}
		}
	}

	if (process.env.NODE_ENV === 'development') {
		console.log(`duplicate.findbycomm total unique contacts: ${allContactIds.size}`)
	}

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
			order: { ID: 'DESC' }
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
				order: { ID: 'DESC' }
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
		order: { ID: 'DESC' }
	})
	return deals || []
}

export async function getDealById(id: string): Promise<BitrixDeal | null> {
	const deal = await bitrixCall<BitrixDeal>('crm.deal.get', { id })
	return deal || null
}
