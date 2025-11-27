import type { Metadata } from 'next'
import { TemplateView } from '@views/template'

export const metadata: Metadata = {
  title: 'Для тестирования',
  description: 'Для тестирования'
}

export default function Template() {
  return (
    <TemplateView
      printIcons={[
        '/images/sticker-dino.png',
        '/images/sticker-shark.png',
        '/icons/logo.svg',
        '/images/favicon/shark-fav.svg'
      ]}
    />
  )
}
