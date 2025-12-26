import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/shared/server/session'
import { extractDigits } from '@/shared/utils/phone'
import { findContactIdsByPhone, getContactById, listDealsByContactId, listDealsByCompanyId, listLeadsByContactId, getCompanyById, type BitrixContact, type BitrixDeal, type BitrixCompany } from '@/shared/server/bitrix'

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

      // also try by company
      let companyDeals: BitrixDeal[] = []
      let company: BitrixCompany | null = null
      const companyId = (contact as BitrixContact)?.COMPANY_ID
      if (companyId) {
        console.log(`📋 Contact has COMPANY_ID: ${companyId}, fetching company deals...`)
        companyDeals = await listDealsByCompanyId(String(companyId))
        company = await getCompanyById(String(companyId))
        console.log(`📋 Company deals found: ${companyDeals.length}`)
      }

      // Remove duplicates by ID
      const allDeals = [...allDealsByContacts, ...companyDeals]
      const uniqueDeals = allDeals.filter((deal, index, self) =>
        index === self.findIndex(d => d.ID === deal.ID)
      )

      console.log(`📋 Total unique deals: ${uniqueDeals.length}`, uniqueDeals.map(d => d.ID))

      console.log('🚀 Returning response with deals:', uniqueDeals.length)
      console.log('🚀 ========== /api/b24/me END (contact) ==========\n\n')
      return NextResponse.json({ entity: 'contact', contact, lead: null, deals: uniqueDeals, leads, company, phone: session.phone }, { status: 200 })
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
