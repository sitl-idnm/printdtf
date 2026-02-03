import { NextResponse } from 'next/server'
import { bitrixCall } from '@/shared/server/bitrix'

type DealCategory = {
	ID: number | string
	NAME?: string
	SORT?: number
	IS_DEFAULT?: 'Y' | 'N'
}

type DealStage = {
	STATUS_ID: string
	NAME: string
	COLOR?: string
	SORT?: number
	SEMANTICS?: string
}

export async function GET() {
	try {
		const categories = await bitrixCall<DealCategory[]>('crm.dealcategory.list', {})

		const enriched = []
		const list = Array.isArray(categories) ? categories : []

		for (const cat of list) {
			const catIdNum = typeof cat.ID === 'string' ? Number(cat.ID) : cat.ID
			const stages = await bitrixCall<DealStage[]>('crm.dealcategory.stage.list', { id: catIdNum })
			const mapped = (stages || []).map(s => {
				const isDefault = !catIdNum || catIdNum === 0
				// Full STAGE_ID: for default category it's just STATUS_ID (e.g., "NEW")
				// For custom category: "C{categoryId}:{STATUS_ID}" (e.g., "C3:NEW")
				const stageId = isDefault ? s.STATUS_ID : `C${catIdNum}:${s.STATUS_ID}`
				return {
					statusId: s.STATUS_ID,
					name: s.NAME,
					stageId,
					color: s.COLOR,
					sort: s.SORT,
					semantics: s.SEMANTICS
				}
			})
			enriched.push({
				categoryId: catIdNum,
				categoryName: cat.NAME,
				isDefault: cat.IS_DEFAULT === 'Y' || !catIdNum,
				stages: mapped
			})
		}

		// Fallback: if no categories returned, try default pipeline stages (id: 0)
		if (enriched.length === 0) {
			const stages = await bitrixCall<DealStage[]>('crm.dealcategory.stage.list', { id: 0 })
			const mapped = (stages || []).map(s => ({
				statusId: s.STATUS_ID,
				name: s.NAME,
				stageId: s.STATUS_ID, // default category uses plain STATUS_ID
				color: s.COLOR,
				sort: s.SORT,
				semantics: s.SEMANTICS
			}))
			if (mapped.length > 0) {
				enriched.push({
					categoryId: 0,
					categoryName: 'Default',
					isDefault: true,
					stages: mapped
				})
			}
		}

		return NextResponse.json({ categories: enriched }, { status: 200 })
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console.error('Error fetching deal stages:', message)
		}
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

