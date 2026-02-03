import { NextRequest, NextResponse } from 'next/server'
import { bitrixCall, getDealById, getContactById, getCompanyById } from '@/shared/server/bitrix'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const deal = await getDealById(id)
    if (!deal) return NextResponse.json({ deal: null }, { status: 200 })
    const contact = deal.CONTACT_ID ? await getContactById(deal.CONTACT_ID) : null

    // Also fetch contacts bound via items API (CONTACT_ID may be deprecated)
    let contactItems: Array<{ CONTACT_ID: number; IS_PRIMARY?: 'Y' | 'N'; SORT?: number }> = []
    try {
      const items = await bitrixCall<Array<{ CONTACT_ID: number; IS_PRIMARY?: 'Y' | 'N'; SORT?: number }>>(
        'crm.deal.contact.items.get',
        { id: Number(id) }
      )
      contactItems = Array.isArray(items) ? items : []
    } catch {
      // ignore
    }

    // Try to resolve primary contact from contact items
    let primaryContact = contact
    if (!primaryContact && contactItems.length > 0) {
      const primary = contactItems.find(c => c.IS_PRIMARY === 'Y') || contactItems[0]
      if (primary?.CONTACT_ID) {
        try {
          primaryContact = await getContactById(String(primary.CONTACT_ID))
        } catch {
          // ignore
        }
      }
    }

    const company = deal.COMPANY_ID ? await getCompanyById(deal.COMPANY_ID) : null
    return NextResponse.json({ deal, contact, contactItems, primaryContact, company }, { status: 200 })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e instanceof Error ? e.message : 'Unknown error') }, { status: 500 })
  }
}
