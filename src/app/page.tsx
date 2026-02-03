import type { Metadata } from 'next'
import { HomeView } from '@views/home'

export const metadata: Metadata = {
  title: 'City Group',
  description: ''
}

export default function Home() {
  return <HomeView />
}
