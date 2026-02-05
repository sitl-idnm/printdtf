import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/shared/server/session'
import { extractDigits } from '@/shared/utils/phone'
import { findContactIdsByPhone, getContactById, listDealsByContactId, listDealsByCompanyId, listLeadsByContactId, getCompanyById, getDiskFileMeta, getDiskAttachedMeta, type BitrixContact, type BitrixDeal, type BitrixCompany } from '@/shared/server/bitrix'
import { getValidAccessToken } from '@/shared/server/b24OAuth'

// Отключаем кэширование для этого роута
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  console.log('\n\n🚀 ========== /api/b24/me START ==========')
  console.log('🚀 Request received at:', new Date().toISOString())

  try {
    const cookieName = getSessionCookieName()
    const token = req.cookies.get(cookieName)?.value
    console.log('🚀 Token exists:', !!token)

    const session = verifySessionToken(token)
    console.log('🚀 Session:', session ? { phone: session.phone } : 'null')

    if (!session?.phone) {
      console.log('🚀 Unauthorized - no session phone')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const digits = extractDigits(session.phone)
    console.log('🚀 Phone digits:', digits)

    // Работаем ТОЛЬКО с контактами (не с лидами)
    console.log('🚀 Trying to find contacts...')
    const contactIds = await findContactIdsByPhone(digits)
    console.log('🚀 Contact IDs found:', contactIds)

    if (contactIds.length) {
      const targetId = contactIds.sort((a, b) => Number(b) - Number(a))[0]
      console.log(`📋 Getting data for contact ID: ${targetId}`)

      const contact = await getContactById(targetId)
      console.log(`📋 Contact data retrieved, CONTACT_ID: ${(contact as BitrixContact)?.ID}, COMPANY_ID: ${(contact as BitrixContact)?.COMPANY_ID}`)

      // Получаем все телефоны контакта и находим все связанные контакты
      const contactPhones = (contact as BitrixContact)?.PHONE || []
      const allRelatedContactIds = new Set<string>([targetId]) // Включаем основной контакт

      console.log(`📋 Contact has ${contactPhones.length} phone(s):`, contactPhones.map(p => p.VALUE))

      // Для каждого телефона находим все контакты
      for (const phone of contactPhones) {
        const phoneDigits = extractDigits(phone.VALUE)
        if (phoneDigits) {
          console.log(`📋 Searching contacts for phone: ${phone.VALUE} (digits: ${phoneDigits})`)
          const relatedContactIds = await findContactIdsByPhone(phoneDigits)
          relatedContactIds.forEach(id => allRelatedContactIds.add(id))
          console.log(`📋 Found ${relatedContactIds.length} contacts for phone ${phone.VALUE}`)
        }
      }

      console.log(`📋 Total unique related contacts: ${allRelatedContactIds.size}`, Array.from(allRelatedContactIds))

      // Получаем сделки для всех связанных контактов
      const allDealsByContacts: BitrixDeal[] = []
      const relatedContactIdsArray = Array.from(allRelatedContactIds)
      for (const relatedContactId of relatedContactIdsArray) {
        console.log(`📋 Fetching deals for contact ${relatedContactId}...`)
        const contactDeals = await listDealsByContactId(relatedContactId)
        allDealsByContacts.push(...contactDeals)
        console.log(`📋 Found ${contactDeals.length} deals for contact ${relatedContactId}`)
      }

      // Получаем лиды для основного контакта
      const leads = await listLeadsByContactId(targetId)
      console.log(`📋 Leads found: ${leads.length}`)

      // also try by company (only if COMPANY_ID is valid and not "0")
      let companyDeals: BitrixDeal[] = []
      let company: BitrixCompany | null = null
      const rawCompanyId = (contact as BitrixContact)?.COMPANY_ID
      const normalizedCompanyId = rawCompanyId != null ? String(rawCompanyId).trim() : ''
      if (normalizedCompanyId && normalizedCompanyId !== '0') {
        console.log(`📋 Contact has COMPANY_ID: ${normalizedCompanyId}, fetching company deals...`)
        companyDeals = await listDealsByCompanyId(normalizedCompanyId)
        company = await getCompanyById(normalizedCompanyId)
        console.log(`📋 Company deals found: ${companyDeals.length}`)
      } else {
        console.log(`📋 COMPANY_ID is empty or zero (${String(rawCompanyId)}), skip fetching company deals`)
      }

      // Remove duplicates by ID
      const allDeals = [...allDealsByContacts, ...companyDeals]
      const uniqueDeals = allDeals.filter((deal, index, self) =>
        index === self.findIndex(d => d.ID === deal.ID)
      )

      console.log(`📋 Total unique deals: ${uniqueDeals.length}`, uniqueDeals.map(d => d.ID))

      // Преобразуем файловые поля в объекты с ссылками на прокси-скачивание
      const FILE_FIELDS = new Set(['UF_CRM_1730357338802', 'UF_CRM_1760519761774'])

  type UfFileItem = { ID?: string | number; id?: string | number; showUrl?: string }

      // Подтягиваем реальные имена файлов (ограничимся до 20 запросов за вызов)
      const nameCache = new Map<string, string>()
  const resolveFileName = async (id: string, showUrl?: string): Promise<string> => {
        if (nameCache.has(id)) return nameCache.get(id) as string
        try {
          // Пробуем как fileId, затем как attachedObjectId -> OBJECT_ID
          let meta = await getDiskFileMeta(id)
          if (!meta) {
            const attached = await getDiskAttachedMeta(id as string)
            const objectId = attached?.OBJECT_ID ? String(attached.OBJECT_ID) : ''
            if (objectId) {
              meta = await getDiskFileMeta(objectId)
            }
          }
          const metaObj = meta as { NAME?: string; NAME_FILE?: string } | null
          let name = metaObj?.NAME || metaObj?.NAME_FILE

          // Если имя не нашли через Disk — пробуем достать из заголовка Content-Disposition crm.file.get
          if (!name) {
            const base = process.env.BITRIX_WEBHOOK_URL
            if (base) {
              const form = new URLSearchParams()
              form.set('id', id)
              const resp = await fetch(`${base}/crm.file.get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: form
              })
              if (resp.ok) {
                const cd = resp.headers.get('content-disposition') || ''
                const m = /filename\*?=UTF-8''([^;]+)/i.exec(cd) || /filename="?([^"]+)"?/i.exec(cd || '')
                if (m && m[1]) {
                  try { name = decodeURIComponent(m[1]) } catch { name = m[1] }
                }
                // Не тянем тело, чтобы не грузить сеть
                try { await resp.body?.cancel() } catch { /* ignore */ }
              }
            }
          }

      // Если имя не обнаружено и есть showUrl — пробуем через OAuth доступ к show_file.php
      if (!name && showUrl) {
        const origin = process.env.BITRIX_PORTAL_ORIGIN || ''
        const token = await getValidAccessToken()
        if (origin && token) {
          const abs = new URL(showUrl.startsWith('/') ? origin + showUrl : showUrl, origin)
          // добавим auth токен
          const hasAuth = abs.searchParams.has('auth')
          if (!hasAuth || abs.searchParams.get('auth') === '') {
            abs.searchParams.set('auth', token)
          }
          const resp = await fetch(abs.toString(), { method: 'GET', headers: { Accept: '*/*' } })
          if (resp.ok) {
            const cd = resp.headers.get('content-disposition') || ''
            const m = /filename\*?=UTF-8''([^;]+)/i.exec(cd) || /filename="?([^"]+)"?/i.exec(cd || '')
            if (m && m[1]) {
              try { name = decodeURIComponent(m[1]) } catch { name = m[1] }
            }
            try { await resp.body?.cancel() } catch { /* ignore */ }
          }
        }
      }

          const finalName = name || `Файл ${id}`
          nameCache.set(id, String(finalName))
          return String(finalName)
        } catch {
          return `Файл ${id}`
        }
      }

      const dealsWithFiles = await Promise.all(uniqueDeals.map(async (deal) => {
        const patch: Record<string, unknown> = {}
        const dealIdStr = String((deal as Record<string, unknown>).ID)
        for (const key of Object.keys(deal as Record<string, unknown>)) {
          if (!FILE_FIELDS.has(key)) continue
          const raw = (deal as Record<string, unknown>)[key]
          if (!raw) continue
          if (Array.isArray(raw)) {
            const items = await Promise.all(raw.map(async (v, idx) => {
              const item = v as UfFileItem
              const id = String(item?.ID ?? item?.id ?? v ?? '')
              if (!id) return null
          const displayName = await resolveFileName(id, item?.showUrl)
              return {
                id,
                name: displayName || `Файл ${idx + 1}`,
                showUrl: `/api/b24/file?id=${encodeURIComponent(id)}&dealId=${encodeURIComponent(dealIdStr)}`
              }
            })).then(arr => arr.filter(Boolean))
            patch[key] = items
          } else if (typeof raw === 'object') {
            const item = raw as UfFileItem
            const id = String(item?.ID ?? item?.id ?? '')
            if (id) {
          const displayName = await resolveFileName(id, item?.showUrl)
              patch[key] = [{
                id,
                name: displayName || 'Файл',
                showUrl: `/api/b24/file?id=${encodeURIComponent(id)}&dealId=${encodeURIComponent(dealIdStr)}`
              }]
            }
          } else {
            const id = String(raw)
            if (id) {
          const displayName = await resolveFileName(id)
              patch[key] = [{
                id,
                name: displayName || 'Файл',
                showUrl: `/api/b24/file?id=${encodeURIComponent(id)}&dealId=${encodeURIComponent(dealIdStr)}`
              }]
            }
          }
        }
        return { ...(deal as Record<string, unknown>), ...patch }
      }))

      console.log('🚀 Returning response with deals:', dealsWithFiles.length)
      console.log('🚀 ========== /api/b24/me END (contact) ==========\n\n')
      return NextResponse.json({ entity: 'contact', contact, lead: null, deals: dealsWithFiles, leads, company, phone: session.phone }, { status: 200 })
    }

    console.log('🚀 No contacts found')
    console.log('🚀 ========== /api/b24/me END (no data) ==========\n\n')
    return NextResponse.json({ entity: null, lead: null, contact: null, deals: [], phone: session.phone }, { status: 200 })
  } catch (e: unknown) {
    console.error('🚀 ERROR in /api/b24/me:', e)
    console.log('🚀 ========== /api/b24/me END (error) ==========\n\n')
    return NextResponse.json({ error: (e instanceof Error ? e.message : 'Unknown error') }, { status: 500 })
  }
}
