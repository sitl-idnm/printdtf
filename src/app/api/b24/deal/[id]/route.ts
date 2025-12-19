import { NextRequest, NextResponse } from 'next/server'
import { getDealById, getContactById, getCompanyById } from '@/shared/server/bitrix'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const deal = await getDealById(id)
    if (!deal) return NextResponse.json({ deal: null }, { status: 200 })
    const contact = deal.CONTACT_ID ? await getContactById(deal.CONTACT_ID) : null
    const company = deal.COMPANY_ID ? await getCompanyById(deal.COMPANY_ID) : null
    return NextResponse.json({ deal, contact, company }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}