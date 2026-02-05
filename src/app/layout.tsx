import { ReactNode } from 'react'
import { Footer } from '@modules/footer'
import { Header } from '@modules/header'
import Script from 'next/script'
import type { Metadata } from 'next'

import '@styles/global.scss'

import localFont from 'next/font/local'
import { Provider } from '@service/provider'
import ChatWidget from '@modules/chat-widget'
import { ArrowUp } from '@/ui'
import { PageThemeProvider } from './pageThemeProvider'

export const metadata: Metadata = {
  other: {
    // Для верификации Яндекс (если проверка через meta)
    'yandex-verification': 'b385e356905e31f2'
  }
}

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
        <PageThemeProvider>
          <Provider>
            <Header />
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <div id="root">{children}<Footer /></div>
              </div>
            </div>
            <div id="modal-root" />
            <ChatWidget />
            <ArrowUp />

            {/* Yandex.Metrika */}
            <Script id="ym-loader" strategy="afterInteractive">
              {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106625552', 'ym');

              ym(106625552, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:'dataLayer',
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce:true,
                trackLinks:true
              });
              `}
            </Script>
            <noscript>
              <div>
                <img src="https://mc.yandex.ru/watch/106625552" style={{ position: 'absolute', left: '-9999px' }} alt="" />
              </div>
            </noscript>

            {/* Top.Mail.Ru */}
            <Script id="topmail-init" strategy="afterInteractive">
              {`
              (function(w) { w._tmr = w._tmr || []; })(window);
              window._tmr.push({id: "3611462", type: "pageView", start: (new Date()).getTime()});
              (function (d, w, id) {
                if (d.getElementById(id)) return;
                var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
                ts.src = "https://top-fwz1.mail.ru/js/code.js";
                var f = function () {
                  var s = d.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(ts, s);
                };
                if (w.opera == "[object Opera]") {
                  d.addEventListener("DOMContentLoaded", f, false);
                } else { f(); }
              })(document, window, "tmr-code");
              `}
            </Script>
            <noscript>
              <div>
                <img src="https://top-fwz1.mail.ru/counter?id=3611462;js=na" style={{ position: 'absolute', left: '-9999px' }} alt="Top.Mail.Ru" />
              </div>
            </noscript>
          </Provider>
        </PageThemeProvider>
      </body>
    </html>
  )
}
