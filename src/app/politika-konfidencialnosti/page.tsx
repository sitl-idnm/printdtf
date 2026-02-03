import { PolicyView } from '@/views/policy'
import type { Metadata } from 'next'


export const metadata: Metadata = {
	title: 'Политика конфиденциальности и обработки персональных данных',
	description: 'Страница политики конфиденциальности и обработки персональных данных'
}

export default function Home() {
	return <PolicyView />
}
