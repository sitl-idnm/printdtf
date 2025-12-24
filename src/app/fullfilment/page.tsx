import type { Metadata } from 'next'
import FullfilmentPage from '@/views/fullfilmentPage/fullfilmentPage'

export const metadata: Metadata = {
  title: 'Фуллфилмент',
  description: ''
}

export default function Home() {
  return <FullfilmentPage />
}
