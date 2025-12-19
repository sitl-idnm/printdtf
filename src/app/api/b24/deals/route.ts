import { NextRequest, NextResponse } from 'next/server'
import { listDealsByContactId, listDealsByCompanyId } from '@/shared/server/bitrix'

export async function POST (req: NextRequest) {
  try {
    const { contactId, companyId } = (await req.json()) as { contactId?: string; companyId?: string }
    if (!contactId && !companyId) {
      return NextResponse.json({ error: 'contactId or companyId is required' }, { status: 400 })
    }
    if (contactId) {
      const deals = await listDealsByContactId(contactId)
      return NextResponse.json({ deals }, { status: 200 })
    }
    if (companyId) {
      const deals = await listDealsByCompanyId(companyId)
      return NextResponse.json({ deals }, { status: 200 })
    }
    return NextResponse.json({ deals: [] }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}




