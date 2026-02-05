import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/shared/server/session'
import { extractDigits } from '@/shared/utils/phone'
import { findContactIdsByPhone, getDealById, bitrixCall, getDiskFileMeta, getDiskAttachedMeta, type BitrixDeal } from '@/shared/server/bitrix'
import { getValidAccessToken } from '@/shared/server/b24OAuth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Разрешенные поля-файлы на стороне сделок
const DEAL_FILE_FIELDS = ['UF_CRM_1730357338802', 'UF_CRM_1760519761774']

// Простейший in-memory кэш метаданных файлов (10 минут)
type CachedMeta = { name?: string; downloadUrl?: string; ts: number }
const fileMetaCache = new Map<string, CachedMeta>()
const META_TTL_MS = 10 * 60 * 1000

function normalizeId(v: unknown): string {
	if (v === null || v === undefined) return ''
	return String(v).trim()
}

type UfFileItem = { ID?: string | number; id?: string | number; downloadUrl?: string; showUrl?: string }

function isFileInDeal(deal: BitrixDeal, fileId: string): boolean {
	for (const field of DEAL_FILE_FIELDS) {
		const val = deal[field]
		if (!val) continue
		if (Array.isArray(val)) {
			// Массив ID файлов
			if (val.some(x => normalizeId(x) === fileId)) return true
			// Иногда приходит массив объектов
			if (val.some(x => {
				if (typeof x !== 'object' || !x) return false
				const item = x as UfFileItem
				const id = normalizeId(item.ID ?? item.id)
				return id === fileId
			})) return true
		} else if (typeof val === 'object') {
			const item = val as UfFileItem
			const id = normalizeId(item.ID ?? item.id)
			if (id && id === fileId) return true
		} else {
			if (normalizeId(val) === fileId) return true
		}
	}
	return false
}

async function getPortalOriginAndToken(): Promise<{ origin: string; token: string } | null> {
	// Prefer OAuth token if present
	const origin = process.env.BITRIX_PORTAL_ORIGIN || ''
	const oauthToken = await getValidAccessToken()
	if (origin && oauthToken) {
		return { origin, token: oauthToken }
	}
	// Fallback: try to parse token from webhook (not ideal for file download)
	const base = process.env.BITRIX_WEBHOOK_URL || ''
	try {
		const u = new URL(base)
		const parsedOrigin = `${u.protocol}//${u.host}`
		const m = /\/rest\/\d+\/([^/]+)\//.exec(u.pathname)
		const token = m?.[1] || ''
		if (!parsedOrigin || !token) return null
		return { origin: parsedOrigin, token }
	} catch {
		return null
	}
}

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const fileId = url.searchParams.get('id') || ''
		const dealId = url.searchParams.get('dealId') || ''

		if (!fileId) {
			return NextResponse.json({ error: 'Missing file id' }, { status: 400 })
		}
		if (!dealId) {
			return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
		}

		// Авторизация пользователя по сессии
		const cookieName = getSessionCookieName()
		const token = req.cookies.get(cookieName)?.value
		const session = verifySessionToken(token)
		if (!session?.phone) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const phoneDigits = extractDigits(session.phone)
		const userContactIds = await findContactIdsByPhone(phoneDigits)
		if (!userContactIds.length) {
			return NextResponse.json({ error: 'No contact' }, { status: 403 })
		}

		// Проверяем что файл принадлежит сделке, а сделка связана с этим пользователем
		const deal = await getDealById(dealId)
		if (!deal) {
			return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
		}
		// Проверка принадлежности сделки контакту
		const dealContactId = normalizeId((deal as Record<string, unknown>).CONTACT_ID)
		if (!dealContactId || !userContactIds.includes(dealContactId)) {
			// Доп. проверка через crm.deal.contact.items.get
			try {
				const items = await bitrixCall<Array<{ CONTACT_ID: number }>>('crm.deal.contact.items.get', { id: Number(dealId) })
				const dealContactIds = (items || []).map(x => String(x.CONTACT_ID))
				const related = dealContactIds.some(id => userContactIds.includes(id))
				if (!related) {
					return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
				}
			} catch {
				// Если не смогли проверить, не даем доступ
				return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
			}
		}

		// Проверяем, что файл действительно прикреплен к сделке в разрешенных полях
		if (!isFileInDeal(deal, fileId)) {
			return NextResponse.json({ error: 'File not in deal' }, { status: 404 })
		}

		// Попытка 0: использовать прямой downloadUrl/showUrl, который Битрикс возвращает в crm.deal.get
		const portal = await getPortalOriginAndToken()
		if (portal) {
			for (const field of DEAL_FILE_FIELDS) {
				const raw = (deal as Record<string, unknown>)[field]
				if (!raw) continue
				const arr = Array.isArray(raw) ? raw : [raw]
				for (const it of arr as Array<unknown>) {
					if (!it || typeof it !== 'object') continue
					const item = it as UfFileItem
					const id = normalizeId(item.ID ?? item.id)
					if (id !== fileId) continue
					const rel = String(item.downloadUrl || item.showUrl || '')
					if (rel) {
						// Построим абсолютную ссылку и подставим auth=<token> если пустой
						const abs = new URL(rel.startsWith('/') ? portal.origin + rel : rel, portal.origin)
						const auth = abs.searchParams.get('auth')
						if (auth !== null && auth.trim() === '') {
							abs.searchParams.set('auth', portal.token)
						} else if (auth === null) {
							abs.searchParams.set('auth', portal.token)
						}
						const upstream0 = await fetch(abs.toString())
						if (upstream0.ok && upstream0.body) {
							const ct = upstream0.headers.get('content-type') || 'application/octet-stream'
							let fileName0 = `file-${fileId}`
							const cd0 = upstream0.headers.get('content-disposition') || ''
							const m0 = /filename\*?=UTF-8''([^;]+)/i.exec(cd0) || /filename="?([^"]+)"?/i.exec(cd0 || '')
							if (m0 && m0[1]) {
								try { fileName0 = decodeURIComponent(m0[1]) } catch { fileName0 = m0[1] }
							}
							return new NextResponse(upstream0.body, {
								status: 200,
								headers: {
									'Content-Type': ct,
									'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName0)}`,
									'Cache-Control': 'private, max-age=300'
								}
							})
						}

						// Попытка 0.1: логин по логину/паролю (если заданы), прямо в show_file.php с login=yes
						const login = process.env.BITRIX_LOGIN || ''
						const password = process.env.BITRIX_PASSWORD || ''
						if (login && password) {
							try {
								// Мини-куки-джар
								const cookieJar = new Map<string, string>()
								const getCookieHeader = () =>
									Array.from(cookieJar.entries()).map(([k, v]) => `${k}=${v}`).join('; ')
								type HeadersWithRaw = Headers & { raw?: () => Record<string, string[]> }
								const captureCookies = (resp: Response) => {
									const withRaw = resp.headers as HeadersWithRaw
									const rawMap = typeof withRaw.raw === 'function' ? withRaw.raw() : undefined
									const fromRaw = rawMap ? rawMap['set-cookie'] : undefined
									const setCookie = fromRaw ?? resp.headers.get('set-cookie')
									const list = Array.isArray(setCookie) ? setCookie : (setCookie ? [setCookie] : [])
									for (const c of list) {
										const [pair] = (c || '').split(';')
										const [name, ...rest] = pair.split('=')
										if (name && rest.length) {
											cookieJar.set(name.trim(), rest.join('=').trim())
										}
									}
								}

								// A) первичный GET (получаем сессии/куки)
								const pre = await fetch(abs.toString(), {
									method: 'GET',
									headers: { 'Accept': '*/*' }
								})
								captureCookies(pre)

								// B) логинимся на корне портала ?login=yes
								const loginEndpoint = new URL(portal.origin)
								loginEndpoint.searchParams.set('login', 'yes')
								const formLogin = new URLSearchParams()
								formLogin.set('AUTH_FORM', 'Y')
								formLogin.set('TYPE', 'AUTH')
								formLogin.set('USER_LOGIN', login)
								formLogin.set('USER_PASSWORD', password)
								formLogin.set('USER_REMEMBER', 'Y')
								const respAuth = await fetch(loginEndpoint.toString(), {
									method: 'POST',
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
										'Accept': '*/*',
										'Cookie': getCookieHeader()
									},
									body: formLogin
								})
								captureCookies(respAuth)

								// C) повторный GET файла с куки
								const respFile = await fetch(abs.toString(), {
									method: 'GET',
									headers: { 'Accept': '*/*', 'Cookie': getCookieHeader() }
								})
								if (respFile.ok && respFile.body) {
									const ct = respFile.headers.get('content-type') || 'application/octet-stream'
									if (!ct.includes('text/html')) {
										let fileName0 = `file-${fileId}`
										const cd0 = respFile.headers.get('content-disposition') || ''
										const m0 = /filename\*?=UTF-8''([^;]+)/i.exec(cd0) || /filename="?([^"]+)"?/i.exec(cd0 || '')
										if (m0 && m0[1]) {
											try { fileName0 = decodeURIComponent(m0[1]) } catch { fileName0 = m0[1] }
										}
										return new NextResponse(respFile.body, {
											status: 200,
											headers: {
												'Content-Type': ct,
												'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName0)}`,
												'Cache-Control': 'private, max-age=300'
											}
										})
									}
								}
							} catch {
								// ignore
							}
						}
					}
				}
			}
		}

		// Берем DOWNLOAD_URL через disk.file.get (с кэшем). Если id оказался ID прикрепленного объекта, найдем реальный fileId через disk.attachedObject.get
		const now = Date.now()
		let cached = fileMetaCache.get(fileId)
		if (cached && (now - cached.ts) < META_TTL_MS) {
			// ok
		} else {
			// 1) Пробуем как fileId
			let meta = await getDiskFileMeta(fileId)
			// 2) Если нет, возможно это attachedObjectId -> достаем OBJECT_ID и пробуем снова
			if (!meta) {
				const attached = await getDiskAttachedMeta(fileId)
				const objectId = attached?.OBJECT_ID ? String(attached.OBJECT_ID) : ''
				if (objectId) {
					meta = await getDiskFileMeta(objectId)
				}
			}
			const metaObj = meta as { DOWNLOAD_URL?: string; NAME?: string; NAME_FILE?: string } | null
			const dl = metaObj?.DOWNLOAD_URL || ''
			const nm = metaObj?.NAME || metaObj?.NAME_FILE
			cached = { name: nm ? String(nm) : undefined, downloadUrl: dl ? String(dl) : undefined, ts: now }
			fileMetaCache.set(fileId, cached)
		}

		let downloadUrl = cached?.downloadUrl
		let fileName = cached?.name || `file-${fileId}`

		// Если DOWNLOAD_URL нет (бывает на вебхуках) — пробуем создать внешнюю ссылку через disk.externalLink.add
		if (!downloadUrl) {
			const base = process.env.BITRIX_WEBHOOK_URL
			if (!base) {
				return NextResponse.json({ error: 'Missing BITRIX_WEBHOOK_URL' }, { status: 500 })
			}
			const tryExternalLink = async (idToLink: string) => {
				try {
					// objectId должен быть ID файла на Диске
					const payload = new URLSearchParams()
					payload.set('objectId', idToLink)
					const resp = await fetch(`${base}/disk.externalLink.add.json`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body: payload
					})
					const data = await resp.json().catch(() => ({}))
					const link = data?.result?.LINK || data?.result?.link || data?.result?.DOWNLOAD_URL || data?.result?.downloadUrl
					return typeof link === 'string' ? link : ''
				} catch {
					return ''
				}
			}
			// 1) пробуем как fileId
			let ext = await tryExternalLink(fileId)
			// 2) если пусто — пробуем как OBJECT_ID
			if (!ext) {
				const attached = await getDiskAttachedMeta(fileId)
				const objectId = attached?.OBJECT_ID ? String(attached.OBJECT_ID) : ''
				if (objectId) {
					ext = await tryExternalLink(objectId)
				}
			}
			if (!ext) {
				// 3) финальный фолбэк — crm.file.get (если UF хранит b_file ID)
				const form = new URLSearchParams()
				form.set('id', fileId)
				const resp = await fetch(`${base}/crm.file.get`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: form
				})
				if (resp.ok && resp.body) {
					const contentType = resp.headers.get('content-type') || 'application/octet-stream'
					const cd = resp.headers.get('content-disposition') || ''
					const m = /filename\*?=UTF-8''([^;]+)/i.exec(cd) || /filename="?([^"]+)"?/i.exec(cd || '')
					if (m && m[1]) {
						try { fileName = decodeURIComponent(m[1]) } catch { fileName = m[1] }
					}
					return new NextResponse(resp.body, {
						status: 200,
						headers: {
							'Content-Type': contentType,
							'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
							'Cache-Control': 'private, max-age=300'
						}
					})
				}
				return NextResponse.json({ error: 'Cannot get download URL', detail: 'no DOWNLOAD_URL, externalLink or crm.file' }, { status: 404 })
			}
			downloadUrl = ext
		}

		// Прокси-скачивание
		const upstream = await fetch(downloadUrl)
		if (!upstream.ok || !upstream.body) {
			return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
		}

		let contentType = upstream.headers.get('content-type') || 'application/octet-stream'
		// Пытаемся вытащить оригинальное имя из Content-Disposition
		let finalCd = upstream.headers.get('content-disposition') || ''
		let finalMatch = /filename\*?=UTF-8''([^;]+)/i.exec(finalCd) || /filename="?([^"]+)"?/i.exec(finalCd || '')
		if (finalMatch && finalMatch[1]) {
			try { fileName = decodeURIComponent(finalMatch[1]) } catch { fileName = finalMatch[1] }
		}

		// Если Битрикс вернул HTML (страница логина/доступ запрещен) или нет Content-Disposition,
		// пробуем забрать файл напрямую через CRM API (crm.file.get) по ID
		if (contentType.includes('text/html') || !finalCd) {
			const base = process.env.BITRIX_WEBHOOK_URL
			if (base) {
				const form = new URLSearchParams()
				form.set('id', fileId)
				const resp = await fetch(`${base}/crm.file.get`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: form
				})
				if (resp.ok && resp.body) {
					contentType = resp.headers.get('content-type') || 'application/octet-stream'
					finalCd = resp.headers.get('content-disposition') || ''
					finalMatch = /filename\*?=UTF-8''([^;]+)/i.exec(finalCd) || /filename="?([^"]+)"?/i.exec(finalCd || '')
					if (finalMatch && finalMatch[1]) {
						try { fileName = decodeURIComponent(finalMatch[1]) } catch { fileName = finalMatch[1] }
					} else {
						// Фолбэк имени: file-<id>.<ext из content-type>
						const ext = (function mapExt(ct: string): string {
							const m = ct.toLowerCase()
							if (m.includes('pdf')) return 'pdf'
							if (m.includes('png')) return 'png'
							if (m.includes('jpeg')) return 'jpg'
							if (m.includes('jpg')) return 'jpg'
							if (m.includes('webp')) return 'webp'
							if (m.includes('gif')) return 'gif'
							if (m.includes('svg')) return 'svg'
							if (m.includes('zip')) return 'zip'
							if (m.includes('rar')) return 'rar'
							if (m.includes('msword')) return 'doc'
							if (m.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'docx'
							if (m.includes('vnd.ms-excel')) return 'xls'
							if (m.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'xlsx'
							if (m.includes('vnd.ms-powerpoint')) return 'ppt'
							if (m.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) return 'pptx'
							return ''
						})(contentType)
						fileName = ext ? `file-${fileId}.${ext}` : `file-${fileId}`
					}
					return new NextResponse(resp.body, {
						status: 200,
						headers: {
							'Content-Type': contentType,
							'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
							'Cache-Control': 'private, max-age=300'
						}
					})
				}
			}
		}

		// Если всё ещё нет имени — фолбэк по content-type
		if (!finalCd) {
			const ext = (function mapExt(ct: string): string {
				const m = ct.toLowerCase()
				if (m.includes('pdf')) return 'pdf'
				if (m.includes('png')) return 'png'
				if (m.includes('jpeg')) return 'jpg'
				if (m.includes('jpg')) return 'jpg'
				if (m.includes('webp')) return 'webp'
				if (m.includes('gif')) return 'gif'
				if (m.includes('svg')) return 'svg'
				if (m.includes('zip')) return 'zip'
				if (m.includes('rar')) return 'rar'
				if (m.includes('msword')) return 'doc'
				if (m.includes('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'docx'
				if (m.includes('vnd.ms-excel')) return 'xls'
				if (m.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'xlsx'
				if (m.includes('vnd.ms-powerpoint')) return 'ppt'
				if (m.includes('vnd.openxmlformats-officedocument.presentationml.presentation')) return 'pptx'
				return ''
			})(contentType)
			if (!fileName || /^file-\d+$/i.test(fileName)) {
				fileName = ext ? `file-${fileId}.${ext}` : `file-${fileId}`
			}
		}
		const res = new NextResponse(upstream.body, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
				'Cache-Control': 'private, max-age=300'
			}
		})
		return res
	} catch (e: unknown) {
		return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
	}
}

