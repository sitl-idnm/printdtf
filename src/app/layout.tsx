import { ReactNode } from 'react'
import { Footer } from '@modules/footer'
import { Header } from '@modules/header'

import '@styles/global.scss'

import localFont from 'next/font/local'
import { Provider } from '@service/provider'
import { SmoothProvider } from '@service/smooth'

const font = localFont({
  src: [
    {
      path: './fonts/neuemachina-light.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/neuemachina-regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './fonts/neuemachina-medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/neuemachina-ultrabold.woff2',
      weight: '800',
      style: 'normal'
    }
  ]
})

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={font.className}>
        <Provider>
          <SmoothProvider>
            <Header />
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <div id="root">{children}<Footer /></div>
              </div>
            </div>
            <div id="modal-root" />
          </SmoothProvider>
        </Provider>
      </body>
    </html>
  )
}
