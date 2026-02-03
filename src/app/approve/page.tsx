import { OfertaView } from '@/views/oferta'
import type { Metadata } from 'next'


export const metadata: Metadata = {
	title: 'Согласие на обработку персональных данных',
	description: 'Страница согласия на обработку персональных данных'
}

export default function Home() {
	return <OfertaView />
}
