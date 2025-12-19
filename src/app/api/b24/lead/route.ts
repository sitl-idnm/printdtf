import { NextRequest, NextResponse } from 'next/server'
import { normalizePhoneToE164, extractDigits } from '@/shared/utils/phone'
import { findLeadIdsByPhone, getLeadById, findContactIdsByPhone, getContactById } from '@/shared/server/bitrix'

export async function POST (req: NextRequest) {
  try {
    const { phone } = (await req.json()) as { phone?: string }
    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    const normalized = normalizePhoneToE164(phone)
    const digits = extractDigits(normalized)
    const leadIds = await findLeadIdsByPhone(digits)
    if (leadIds.length) {
      const leadId = leadIds.sort((a, b) => Number(b) - Number(a))[0]
      const lead = await getLeadById(leadId)
      return NextResponse.json({ entity: 'lead', lead, phone: normalized }, { status: 200 })
    }
    // Fallback: maybe it's a Contact, not a Lead
    const contactIds = await findContactIdsByPhone(digits)
    if (contactIds.length) {
      const contactId = contactIds.sort((a, b) => Number(b) - Number(a))[0]
      const contact = await getContactById(contactId)
      return NextResponse.json({ entity: 'contact', contact, phone: normalized }, { status: 200 })
    }
    return NextResponse.json({ entity: null, lead: null, contact: null, phone: normalized }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
