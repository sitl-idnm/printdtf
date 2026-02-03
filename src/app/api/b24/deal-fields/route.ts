import { NextResponse } from 'next/server'
import { bitrixCall } from '@/shared/server/bitrix'

export async function GET() {
	try {
		// Returns metadata for all deal fields (codes, titles, types)
		const fields = await bitrixCall<Record<string, unknown>>('crm.deal.fields', {})
		return NextResponse.json({ fields }, { status: 200 })
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

