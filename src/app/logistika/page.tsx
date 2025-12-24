import type { Metadata } from 'next'
import LogistikaPage from '@/views/logistikaPage/logistikaPage'

export const metadata: Metadata = {
  title: 'Логистика',
  description: ''
}

export default function Home() {
  return <LogistikaPage />
}
