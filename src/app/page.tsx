import type { Metadata } from 'next'
import { HomeView } from '@views/home'

export const metadata: Metadata = {
  title: 'CenterGroup',
  description: ''
}

export default function Home() {
  return <HomeView />
}
