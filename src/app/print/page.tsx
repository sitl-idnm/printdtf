import type { Metadata } from 'next'
import PrintPage from '@/views/printPage/printPage'

export const metadata: Metadata = {
  title: 'Принт',
  description: ''
}

export default function Home() {
  return <PrintPage />
}
