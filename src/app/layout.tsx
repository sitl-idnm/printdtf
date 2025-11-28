import { ReactNode } from 'react'
import { Footer } from '@modules/footer'
import { Header } from '@modules/header'

import '@styles/global.scss'

import localFont from 'next/font/local'
import { Provider } from '@service/provider'

const involve = localFont({
  src: [
    {
      path: './fonts/Involve-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/Involve-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './fonts/Involve-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-involve'
})

const unbounded = localFont({
  src: [
    {
      path: './fonts/Unbounded-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-unbounded'
})

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${involve.variable} ${unbounded.variable}`}>
        <Provider>
            <Header />
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <div id="root">{children}<Footer /></div>
              </div>
            </div>
            <div id="modal-root" />
        </Provider>
      </body>
    </html>
  )
}
