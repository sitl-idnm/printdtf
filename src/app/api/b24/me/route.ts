import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/shared/server/session'
import { extractDigits } from '@/shared/utils/phone'
import { findLeadIdsByPhone, getLeadById, findContactIdsByPhone, getContactById, listDealsByContactId, listDealsByCompanyId } from '@/shared/server/bitrix'

export async function GET (req: NextRequest) {
  try {
    const cookieName = getSessionCookieName()
    const token = req.cookies.get(cookieName)?.value
    const session = verifySessionToken(token)
    if (!session?.phone) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const digits = extractDigits(session.phone)

    // Try lead first
    const leadIds = await findLeadIdsByPhone(digits)
    if (leadIds.length) {
      const targetId = leadIds.sort((a, b) => Number(b) - Number(a))[0]
      const lead = await getLeadById(targetId)
      return NextResponse.json({ entity: 'lead', lead, contact: null, deals: [], phone: session.phone }, { status: 200 })
    }

    // Fallback to contact
    const contactIds = await findContactIdsByPhone(digits)
    if (contactIds.length) {
      const targetId = contactIds.sort((a, b) => Number(b) - Number(a))[0]
      const contact = await getContactById(targetId)
      const deals = await listDealsByContactId(targetId)
      // also try by company
      let companyDeals: any[] = []
      const companyId = (contact as any)?.COMPANY_ID
      if (companyId) {
        companyDeals = await listDealsByCompanyId(String(companyId))
      }
      return NextResponse.json({ entity: 'contact', contact, lead: null, deals: [...deals, ...companyDeals], phone: session.phone }, { status: 200 })
    }

    return NextResponse.json({ entity: null, lead: null, contact: null, deals: [], phone: session.phone }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


