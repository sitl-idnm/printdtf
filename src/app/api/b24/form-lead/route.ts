import { NextRequest, NextResponse } from 'next/server'
import { bitrixCall, findContactIdsByPhone } from '@/shared/server/bitrix'
import { normalizePhoneToE164, extractDigits } from '@/shared/utils/phone'
import crypto from 'node:crypto'

type IncomingBody = {
	name?: string
	phone?: string
	messenger?: string
	method?: string
	methodKey?: string
	agree?: boolean
	page?: string
	formTitle?: string
}

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as IncomingBody
		const {
			name,
			phone,
			messenger,
			method,
			methodKey,
			page,
			formTitle
		} = body || {}

		if (!name || !phone) {
			return NextResponse.json({ error: 'name and phone are required' }, { status: 400 })
		}

		const normalizedPhone = normalizePhoneToE164(phone)
		const phoneDigits = extractDigits(normalizedPhone || phone || '')

		const title = 'Новая заявка с сайта city-group.pro'

		// Build idempotency keys
		const originatorId = process.env.BITRIX_ORIGINATOR_ID || 'website-city-group.pro'
		const pageForHash = (page || '').split('?')[0] || ''
		const hashBase = JSON.stringify({
			name: (name || '').trim().toLowerCase(),
			phone: (normalizedPhone || phone || '').trim(),
			formTitle: (formTitle || '').trim().toLowerCase(),
			page: pageForHash
		})
		const originId = crypto.createHash('sha256').update(hashBase).digest('hex')

		// Check existing deal with same originator+origin id (idempotency)
		try {
			const existing = await bitrixCall<{ ID: string }[]>('crm.deal.list', {
				filter: { ORIGINATOR_ID: originatorId, ORIGIN_ID: originId },
				select: ['ID'],
				order: { ID: 'DESC' }
			})
			if (Array.isArray(existing) && existing.length > 0) {
				const existingId = existing[0]?.ID
				return NextResponse.json({ id: existingId || null, ok: true, duplicate: true })
			}
		} catch {
			// If listing fails, continue to attempt creation (no destructive ops made)
		}

		// Put limited info into COMMENTS (as requested)
		const commentsLines = [
			formTitle ? `Форма: ${formTitle}` : null,
			page ? `Страница: ${page}` : null,
			messenger ? `Мессенджер: ${messenger}` : null,
			// Keep IP for diagnostics if needed (not shown per request)
			// clientIp ? `IP: ${clientIp}` : null
		].filter(Boolean)
		const COMMENTS = commentsLines.join('\n')

		// Ensure Contact exists by phone and get CONTACT_ID
		let contactId: string | undefined
		const debugContact: Record<string, unknown> = {}
		if (phoneDigits) {
			try {
				const ids = await findContactIdsByPhone(phoneDigits)
				if (ids && ids.length > 0) {
					contactId = String(ids[0])
					debugContact.foundByPhone = true
					debugContact.id = contactId
				} else if (normalizedPhone) {
					// Create new contact
					const contactRes = await bitrixCall<number>('crm.contact.add', {
						fields: {
							NAME: name || 'Клиент',
							SOURCE_ID: 'WEB',
							PHONE: [{ VALUE: normalizedPhone, VALUE_TYPE: 'WORK' }]
						},
						params: { REGISTER_SONET_EVENT: 'Y' }
					})
					if (contactRes) {
						contactId = String(contactRes)
						debugContact.created = true
						debugContact.id = contactId
					}
				}
			} catch (e) {
				// If lookup or creation fails, proceed without CONTACT_ID
				debugContact.error = e instanceof Error ? e.message : String(e)
			}
		}

		// Map print method to a dedicated custom deal field (ENUM)
		// Default to the actual field you have in CRM; can be overridden via env
		const methodFieldCode = process.env.BITRIX_DEAL_METHOD_FIELD || 'UF_CRM_1730361963003'
		const methodHuman = method === 'UV DTF' || method === 'DTF'
			? method
			: (methodKey === 'uvdtf' ? 'UV DTF' : (methodKey === 'dtf' ? 'DTF' : undefined))
		// Your enum items for "Метод печати":
		// DTF -> ID 119, UV-DTF -> ID 121
		const methodEnumId = methodHuman === 'DTF' ? '119'
			: (methodHuman === 'UV DTF' ? '121' : undefined)

		const stageId = process.env.BITRIX_DEAL_STAGE_NEW || 'NEW'
		const categoryId = process.env.BITRIX_DEAL_CATEGORY_ID

		const fields: Record<string, unknown> = {
			TITLE: title,
			// Deals don't have direct PHONE/NAME fields; add details into COMMENTS
			SOURCE_ID: 'WEB',
			STAGE_ID: stageId, // default or env-configured "New" stage
			CATEGORY_ID: categoryId,
			ORIGINATOR_ID: originatorId,
			ORIGIN_ID: originId,
			COMMENTS,
			CONTACT_ID: contactId ? Number(contactId) : undefined,
			CONTACT_IDS: contactId ? [Number(contactId)] : undefined
		}
		if (methodEnumId) {
			fields[methodFieldCode] = methodEnumId
		}

		const result = await bitrixCall<number>('crm.deal.add', {
			fields,
			params: { REGISTER_SONET_EVENT: 'Y' }
		})

		const dealId = result ? String(result) : null

		// Ensure contact is bound to the deal (some accounts require explicit binding)
		const binding: Record<string, unknown> = {}
		if (dealId && contactId) {
			try {
				const dealIdNum = Number(dealId)
				const contactIdNum = Number(contactId)
				// Preferred: set full contact list with primary flag
				await bitrixCall('crm.deal.contact.items.set', {
					id: dealIdNum,
					items: [{ CONTACT_ID: contactIdNum, IS_PRIMARY: 'Y', SORT: 10 }]
				})
				binding.method = 'items.set'
				binding.ok = true
			} catch {
				// Fallback 1: add single contact link
				try {
					const dealIdNum = Number(dealId)
					const contactIdNum = Number(contactId)
					await bitrixCall('crm.deal.contact.add', {
						id: dealIdNum,
						fields: { CONTACT_ID: contactIdNum }
					})
					binding.method = 'contact.add'
					binding.ok = true
				} catch {
					// Fallback 2: set fields directly on the deal
					try {
						const dealIdNum = Number(dealId)
						const contactIdNum = Number(contactId)
						await bitrixCall('crm.deal.update', {
							id: dealIdNum,
							fields: { CONTACT_ID: contactIdNum, CONTACT_IDS: [contactIdNum] }
						})
						binding.method = 'deal.update'
						binding.ok = true
					} catch {
						// Non-fatal
						binding.ok = false
					}
				}
			}
		}

		return NextResponse.json({ id: dealId, ok: true, debug: { contactId, contact: debugContact, binding } })
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error('Bitrix deal create error:', message)
		}
		return NextResponse.json({ ok: false, error: message }, { status: 500 })
	}
}

