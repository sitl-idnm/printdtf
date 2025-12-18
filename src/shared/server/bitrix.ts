type BitrixCommonResponse<T> = {
	result?: T
	time?: any
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

export async function bitrixCall<T>(method: string, params: Record<string, any>): Promise<T> {
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
	const lead = await bitrixCall<BitrixLead>('crm.lead.get', { id })
	const list = await bitrixCall<{ ID: string; PHONE?: any[]; EMAIL?: any[] }[]>('crm.lead.list', {
		filter: { ID: id },
		select: ['ID', 'TITLE', 'STATUS_ID', 'ASSIGNED_BY_ID', 'PHONE', 'EMAIL', 'DATE_CREATE', 'DATE_MODIFY', 'COMMENTS', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'SOURCE_ID', 'OPPORTUNITY', 'CURRENCY_ID']
	}).catch(() => [])
	const enriched = Array.isArray(list) && list.length > 0 ? { ...lead, ...list[0] } : lead
	return enriched || null
}

export async function findContactIdsByPhone(phoneDigits: string): Promise<string[]> {
	type DupResp = {
		CONTACT?: string[]
	}
	const result = await bitrixCall<DupResp>('crm.duplicate.findbycomm', {
		type: 'PHONE',
		values: [phoneDigits]
	})
	return result?.CONTACT || []
}

export async function getContactById(id: string): Promise<BitrixContact | null> {
	const contact = await bitrixCall<BitrixContact>('crm.contact.get', { id })
	const list = await bitrixCall<{ ID: string; PHONE?: any[]; EMAIL?: any[] }[]>('crm.contact.list', {
		filter: { ID: id },
		select: ['ID', 'NAME', 'LAST_NAME', 'SECOND_NAME', 'ASSIGNED_BY_ID', 'PHONE', 'EMAIL', 'DATE_CREATE', 'DATE_MODIFY', 'COMMENTS', 'POST', 'COMPANY_ID', 'TYPE_ID', 'SOURCE_ID']
	}).catch(() => [])
	const enriched = Array.isArray(list) && list.length > 0 ? { ...contact, ...list[0] } : contact
	return enriched || null
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
}

export async function getCompanyById(id: string): Promise<BitrixCompany | null> {
	const company = await bitrixCall<BitrixCompany>('crm.company.get', { id })
	const list = await bitrixCall<{ ID: string; PHONE?: any[]; EMAIL?: any[] }[]>('crm.company.list', {
		filter: { ID: id },
		select: ['ID', 'TITLE', 'ASSIGNED_BY_ID', 'COMPANY_TYPE', 'INDUSTRY', 'PHONE', 'EMAIL', 'COMMENTS', 'DATE_CREATE', 'DATE_MODIFY']
	}).catch(() => [])
	const enriched = Array.isArray(list) && list.length > 0 ? { ...company, ...list[0] } : company
	return enriched || null
}

export async function listDealsByContactId(contactId: string): Promise<BitrixDeal[]> {
	const deals = await bitrixCall<BitrixDeal[]>('crm.deal.list', {
		filter: { CONTACT_ID: contactId },
		select: ['ID', 'TITLE', 'STAGE_ID', 'CATEGORY_ID', 'ASSIGNED_BY_ID', 'CONTACT_ID', 'COMPANY_ID', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'DATE_MODIFY'],
		order: { ID: 'DESC' }
	})
	return deals || []
}

export async function listDealsByCompanyId(companyId: string): Promise<BitrixDeal[]> {
	const deals = await bitrixCall<BitrixDeal[]>('crm.deal.list', {
		filter: { COMPANY_ID: companyId },
		select: ['ID', 'TITLE', 'STAGE_ID', 'CATEGORY_ID', 'ASSIGNED_BY_ID', 'CONTACT_ID', 'COMPANY_ID', 'OPPORTUNITY', 'CURRENCY_ID', 'DATE_CREATE', 'DATE_MODIFY'],
		order: { ID: 'DESC' }
	})
	return deals || []
}

export async function getDealById(id: string): Promise<BitrixDeal | null> {
	const deal = await bitrixCall<BitrixDeal>('crm.deal.get', { id })
	return deal || null
}


