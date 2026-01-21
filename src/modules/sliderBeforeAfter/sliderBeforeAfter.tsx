'use client'
import { FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'

import styles from './sliderBeforeAfter.module.scss'
import { SliderBeforeAfterProps } from './sliderBeforeAfter.types'
import { Advantages } from '@/components'
import { useSetAtom, useAtomValue } from 'jotai'
import { printMethodWriteAtom, printMethodReadAtom, PrintMethod } from '@atoms/printMethodAtom'
import { WhatIs } from '../whatIs'
import { PlusWork } from '../plusWork'
import { Cases } from '../cases'
import { Gallery } from '../gallery'
import { Production } from '../production'
import { FinalOffer } from '../finalOffer'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DynamicBackground, LineButton } from '@/ui'
import { scheduleScrollTriggerRefresh } from '@/shared/lib/scrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)
// import { Stages } from '../stages'

const StagesDTFArray = [
  { title: 'Печать на пленку.', number: 1, text: 'Ваше изображение печатается на специальную пленку цветными  чернилами с белой подложкой чтобы картинка была яркой на любой ткани.' },
  { number: 2, title: 'Нанесение клея.', text: 'Свежий отпечаток равномерно покрывается термоклеевым порошком, который прилипает только к чернилам.' },
  { number: 3, title: 'Плавление.', text: 'Пленка с порошком проходит через печь, где клей плавится, образуя цельную, готовую к переносу картинку.' },
  { number: 4, title: 'Перенос.', text: 'Готовый трансфер вырезается, накладывается на изделие (футболку, сумку и т.д.) и закрепляется с помощью термопресса под давлением и нагревом.' },
  { number: 5, title: 'Фиксация.', text: 'После остывания пленка аккуратно снимается, оставляя на ткани яркое, эластичное и стойкое изображение.' }
]

const StagesUVDTFArray = [
  { number: 1, title: 'Печать УФ-чернилами.', text: 'Изображение наносится на специальную силиконизированную пленку с использованием УФ-чернил (CMYK + белый). Белый слой печатается первым для яркости и насыщенности.' },
  { number: 2, title: 'Мгновенная УФ-сушка.', text: 'Сразу после нанесения чернила проходят под мощной УФ-лампой, которая моментально их полимеризует (затвердевает). Это делает изображение устойчивым и готовым к следующему шагу.' },
  { number: 3, title: 'Нанесение монтажной пленки.', text: 'На затвердевшее изображение с помощью ламинатора накатывается прозрачная клеевая пленка. Она станет тем слоем, который будет удерживать картинку на конечном изделии. ' },
  { number: 4, title: 'Перенос на изделие.', text: 'Декаль накладывается клеевым слоем на целевую поверхность (телефон, ноутбук, стекло, пластик, металл), тщательно разглаживается, после чего защитная подложка клеевого слоя удаляется. Для максимальной прочности переноса часто используется финальное прессование в ручном прессе.' }
]

const whatDTF = [{
  question: 'Что это?',
  answer: 'DTF  — это современная технология прямой печати на специальную пленку с последующим переносом изображения на изделие. Она сочетает высокое качество, универсальность и доступность.'
}, {
  question: 'На что применяется?',
  answer: 'Идеально подходит для печати на практически любой ткани: хлопок, полиэстер, нейлон, смесовые материалы, шерсть и даже кожа. '
}, {
  question: 'Для чего это?',
  answer: <>Это идеальный инструмент для создания:<br />
    •	Фирменного мерча (футболки, толстовки, кепки)<br />
    •	Сувенирной продукции<br />
    •	Корпоративной одежды<br />
    •	Одежды для ивентов и команд<br />
    •	Яркого брендирования малого бизнеса и стартапов<br />
  </>
}]

const whatUVDTF = [{
  question: 'Что это?',
  answer: 'UV DTF — это передовая технология ультрафиолетовой печати на специальную плёнку с последующим переносом. Изображение создаётся многослойными UV-чернилами, которые мгновенно закрепляются излучением, что обеспечивает исключительную чёткость и стойкость.'
}, {
  question: 'На что применяется?',
  answer: 'Технология предназначена для нанесения на гладкие и слабопористые поверхности: пластик, стекло, металл, керамика, дерево с покрытием, а также на чехлы телефонов, ноутбуки, автоэлементы и многое другое.'
}, {
  question: 'Для чего это?',
  answer: <>Это идеальное решение для:<br />
    •	Персонализированных гаджетов и аксессуаров<br />
    •	Рекламных сувениров (брелоки, таблички, стикеры)<br />
    •	Уникального интерьерного декора<br />
    •	Яркого и долговечного брендирования продукции и упаковки<br />
    •	Создания сложных дизайнов с эффектом глянца или объёма<br />
    •	Создания стикерпаков<br />
  </>
}]

const advantagesDTF = [{
  num: 'Печать на любой ткани', text: <>нет ограничений по составу и&nbsp;цвету материала.</>
}, {
  num: 'Идеально для малых тиражей', text: <>выгодно заказывать даже от&nbsp;1&nbsp;штуки.</>
}, {
  num: 'Доступная цена', text: <>низкая себестоимость делает печать экономически выгодной.</>
}, {
  num: 'Высокая износостойкость', text: <>изображение выдерживает многочисленные стирки, не&nbsp;трескается и&nbsp;не&nbsp;выцветает.</>
}, {
  num: 'Мягкое и эластичное нанесение', text: <>принт не ощущается на&nbsp;ткани и&nbsp;не&nbsp;стесняет движения.</>
}, {
  num: 'Яркие цвета и детализация ', text: <>белая подложка гарантирует сочные цвета даже на&nbsp;темных изделиях.</>
}, {
  num: 'Прочность сцепления', text: <>изображение устойчиво к&nbsp;растяжению и&nbsp;механическим воздействиям.</>
}]

const advantagesUVDTF = [{
  num: 'Печать на любых твёрдых поверхностях', text: <>от пластика до&nbsp;стекла и&nbsp;металла.</>
}, {
  num: 'Идеально для микротиражей', text: <>экономически выгодно производить даже один экземпляр.</>
}, {
  num: 'Высокая детализация и глянец', text: <>фотографическое качество изображения с&nbsp;эффектной, яркой поверхностью.</>
}, {
  num: 'Максимальная износостойкость', text: <>декор устойчив к&nbsp;влаге, истиранию, ультрафиолету и&nbsp;агрессивным средам.</>
}, {
  num: 'Готовые переводные стикеры', text: <>полученное изображение представляет собой готовую, гибкую наклейку, которую легко переносить.</>
}, {
  num: 'Скорость производства', text: <>процесс печати и&nbsp;полимеризации происходит очень быстро.</>
}, {
  num: 'Эффект объёмного 3D', text: <>возможность многослойного нанесения для&nbsp;создания тактильной рельефной поверхности.</>
}]

const galleryDTFItems = [
  { id: 1, image: '/images/fotbolka.png', title: 'Футболка', tags: ['DTF'] },
  { id: 2, image: '/images/test.jpg', title: 'Свитшот', tags: ['DTF'] },
  { id: 3, image: '/images/test.jpg', title: 'Худи', tags: ['DTF'] },
  { id: 4, image: '/images/test.jpg', title: 'Куртка', tags: ['DTF'] },
  { id: 5, image: '/images/test.jpg', title: 'Шоппер', tags: ['DTF'] },
  { id: 6, image: '/images/test.jpg', title: 'Кожа', tags: ['DTF'] },
  { id: 7, image: '/images/test.jpg', title: 'Упаковка', tags: ['DTF'] },
  { id: 8, image: '/images/test.jpg', title: 'Кепка', tags: ['DTF'] },
  { id: 9, image: '/images/test.jpg', title: 'Спецодежда', tags: ['DTF'] },
  { id: 10, image: '/images/test.jpg', title: 'Форма (футбол)', tags: ['DTF'] },
]

const galleryUVDTFItems = [
  { id: 11, image: '/images/test.jpg', title: 'Упаковка (коробка/пакеты)', tags: ['UV DTF'] },
  { id: 12, image: '/images/chehol.png', title: 'Чехол', tags: ['UV DTF'] },
  { id: 13, image: '/images/steklo.png', title: 'Стекло (бутылка)', tags: ['UV DTF'] },
  { id: 14, image: '/images/test.jpg', title: 'Дерево (подставка для телефона)', tags: ['UV DTF'] },
  { id: 15, image: '/images/krujka.png', title: 'Кружка', tags: ['UV DTF'] },
  { id: 16, image: '/images/test.jpg', title: 'Желеный термос', tags: ['UV DTF'] },
  { id: 17, image: '/images/sticker-dino.png', title: 'Стикерпаки', tags: ['UV DTF'] },
  { id: 18, image: '/images/test.jpg', title: 'Корпоративные подарки (брелки, магниты, повербанк)', tags: ['UV DTF'] },
  { id: 19, image: '/images/test.jpg', title: 'Спецодежда (каска)', tags: ['UV DTF'] },
]

const SliderBeforeAfter: FC<SliderBeforeAfterProps> = ({
  className,
  // before,
  // after,
  // beforeLabel = 'Before',
  // afterLabel = 'After',
  // initial = 0.5,
}) => {
  const rootClassName = classNames(styles.root, className)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSlide, setCurrentSlide] = useState<number>(1)

  const setPrintMethod = useSetAtom(printMethodWriteAtom)
  const printMethod = useAtomValue(printMethodReadAtom)
  const navigationRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const isInitializedRef = useRef(false)

  // Initialize from URL on mount only
  useEffect(() => {
    if (isInitializedRef.current) return

    const methodFromUrl = searchParams.get('method') as PrintMethod | null
    const validMethod = methodFromUrl === 'dtf' || methodFromUrl === 'uvdtf' ? methodFromUrl : 'dtf'

    setPrintMethod(validMethod)
    setCurrentSlide(validMethod === 'dtf' ? 1 : 2)
    isInitializedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount - initialize from URL once

  // Sync atom changes to URL (when user clicks buttons)
  // NOTE: Avoid syncing atom -> URL in an effect.
  // In some browsers (notably Firefox) this can cause "too many History API calls" during routing/hydration.

  useGSAP(() => {
    if (!navigationRef.current || !rootRef.current) return

    gsap.set(navigationRef.current, {
      y: '-100%',
      opacity: 1
    })

    gsap.to(navigationRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: 'top top',
        toggleActions: 'play none none reverse'
      }
    })

    // Set initial opacity for sections
    if (sectionsRef.current) {
      gsap.set(sectionsRef.current, { opacity: 1 })
    }
  }, { scope: rootRef })

  const [isFading, setIsFading] = useState(false)
  const isDTF = currentSlide === 1
  const sectionsRef = useRef<HTMLDivElement>(null)

  function handleSwitch(target: 1 | 2, method: 'dtf' | 'uvdtf') {
    // Check by printMethod instead of currentSlide to ensure buttons always work
    if (printMethod === method || isFading) return

    // Save scroll position once; avoid repeated scrollTo (it causes jank on mobile)
    const savedScrollY = window.scrollY || window.pageYOffset

    setIsFading(true)

    // Don't kill ScrollTriggers - let components handle their own cleanup/recreation
    // Components using useGSAP with dependencies will automatically recreate ScrollTriggers
    // when their props change (like arrAdvantages, title, etc.)

    // Ensure opacity is set before animation
    gsap.set(sectionsRef.current, { opacity: 1 })

    // Fade out
    gsap.to(sectionsRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        // Change content while invisible
        setCurrentSlide(target)
        setPrintMethod(method)
        // Update URL only on explicit user action to avoid history/replace loops.
        const params = new URLSearchParams(window.location.search)
        params.set('method', method)
        const nextUrl = `${window.location.pathname}?${params.toString()}`
        const currentUrl = `${window.location.pathname}${window.location.search}`
        if (currentUrl !== nextUrl) {
          router.replace(nextUrl, { scroll: false })
        }

        // Wait for React to update DOM before fade in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Ensure starting opacity is 0
            gsap.set(sectionsRef.current, { opacity: 0 })

            // Fade in
            gsap.to(sectionsRef.current, {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.inOut',
              onComplete: () => {
                setIsFading(false)

                // Give React a tick to commit new DOM, then refresh triggers once.
                // `refresh()` should not change scroll position; if anything shifts, restore once.
                requestAnimationFrame(() => {
                  scheduleScrollTriggerRefresh()
                  window.scrollTo(0, savedScrollY)
                })
              }
            })
          })
        })
      }
    })
  }

  return (
    <div className={rootClassName} ref={rootRef}>
      <div className={styles.navigation} ref={navigationRef}>
        <div className={`${styles.navigation_container} ${currentSlide === 1 ? styles.firstSlide : styles.secondSlide}`}>
          <button
            className={classNames(printMethod === 'dtf' && styles.active)}
            onClick={() => {
              handleSwitch(1, 'dtf')
            }}
          >
            DTF
          </button>
          <button
            className={classNames(printMethod === 'uvdtf' && styles.active)}
            onClick={() => {
              handleSwitch(2, 'uvdtf')
            }}
          >
            UV-DTF
          </button>
        </div>
      </div>
      <div className={styles.slider}>
        <div ref={sectionsRef}>
          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <DynamicBackground pin={false}>
                <WhatIs
                  title={isDTF ? 'DTF-печать' : 'UV DTF-печать: стойкий декор для любых поверхностей'}
                  arrWhat={isDTF ? whatDTF : whatUVDTF}
                />
              </DynamicBackground>
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <Advantages
                arrAdvantages={isDTF ? advantagesDTF : advantagesUVDTF}
                title={
                  isDTF
                    ? <><span>Преимущества</span><span>DTF</span></>
                    : <><span>Преимущества</span><span>UV-DTF</span></>
                }
              />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <LineButton />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <Gallery
                title="ПОРТФОЛИО"
                description=""
                items={printMethod === 'dtf' ? galleryDTFItems : galleryUVDTFItems}
              />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <Cases
                items={[
                  {
                    id: 'sber',
                    kicker: 'Сбер',
                    type: 'UV DTF',
                    title: 'УФ DTF стикерпаки',
                    task: 'Печать брендированных стикерпаков для Сбера с точным попаданием в цвет и последующей плоттерной резкой.',
                    whatWeDid: (
                      <ul>
                        <li>УФ DTF печать</li>
                        <li>Тестовая печать для согласования цветов и макетов</li>
                        <li>Плоттерная резка</li>
                      </ul>
                    ),
                    result: 'Заказ выполнен в срок, все цвета и макеты согласованы заранее, продукция полностью соответствовала бренд-требованиям клиента.',
                    stats: [
                      { value: '120', note: 'м' },
                      { value: '3500', note: 'шт' },
                      { value: '5', note: 'день' }
                    ],
                    image: '/images/sticker-dino.png'
                  },
                  {
                    id: 'ducks',
                    kicker: '—',
                    type: 'UV DTF',
                    title: 'Нанесение на резиновых уточек',
                    task: 'Нанести принт на резиновых уточек разного размера, включая нестандартные крупные изделия.',
                    whatWeDid: (
                      <ul>
                        <li>Печать и перенос изображения</li>
                        <li>Работа с нестандартной формой изделия</li>
                      </ul>
                    ),
                    result: 'Качественное нанесение даже на сложную поверхность и быстрые сроки при нестандартной задаче.',
                    stats: [
                      { value: '50', note: 'шт' },
                      { value: '20', note: 'см' },
                      { value: '3', note: 'день' }
                    ],
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'lukoil',
                    kicker: 'ЛУКОЙЛ',
                    type: 'DTF',
                    title: 'Печать логотипа на футболках',
                    task: 'Срочный тираж брендированных футболок в сжатые сроки.',
                    whatWeDid: (
                      <ul>
                        <li>Печать логотипа</li>
                        <li>Перенос изображения</li>
                        <li>Упаковка готовых изделий</li>
                      </ul>
                    ),
                    result: 'Крупный тираж выполнен максимально быстро без потери качества — заказчик получил готовую продукцию точно в срок.',
                    stats: [
                      { value: '1000', note: 'шт' },
                      { value: '2', note: 'день' },
                      { value: '—', note: '' }
                    ],
                    image: '/images/fotbolka.png'
                  },
                  {
                    id: 'mossport',
                    kicker: 'Мосспорт',
                    type: 'DTF',
                    title: 'Нанесение на наборы с карандашами',
                    task: 'Брендирование комплектов с карандашами.',
                    whatWeDid: (
                      <ul>
                        <li>DTF печать</li>
                        <li>Нанесение на блокноты</li>
                      </ul>
                    ),
                    result: 'Большой объём выполнен за сутки — идеальное решение для срочных проектов.',
                    stats: [
                      { value: '2000', note: 'наборов' },
                      { value: '1', note: 'сутки' },
                      { value: '—', note: '' }
                    ],
                    image: '/images/notebook.png'
                  }
                ].filter((item) => (isDTF ? item.type === 'DTF' : item.type === 'UV DTF'))}
              />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <Production
                key={printMethod}
                title={isDTF ? 'DTF процесс производства' : 'UV DTF процесс производства'}
                titleArr={
                  isDTF
                    ? [
                      { name: 'Печать на пленку' },
                      { name: 'Нанесение клея' },
                      { name: 'Плавление' },
                      { name: 'Перенос' },
                      { name: 'Фиксация' }
                    ]
                    : [
                      { name: 'Печать УФ-чернилами' },
                      { name: 'Мгновенная УФ-сушка' },
                      { name: 'Нанесение монтажной пленки' },
                      { name: 'Перенос на изделие' }
                    ]
                }
                videoSrcs={isDTF ? ['/videos/6.mp4', '/videos/6.mp4', '/videos/6.mp4'] : ['/videos/6.mp4', '/videos/6.mp4', '/videos/6.mp4']}
              />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <PlusWork arrPlusWork={isDTF ? StagesDTFArray : StagesUVDTFArray} />
            </div>
          </div>

          <div className={`${styles.section} ${styles.sectionOpen}`}>
            <div className={styles.sectionInner}>
              <DynamicBackground pin={false} variant={'swirl-2'}>
                <FinalOffer useAtomPrintMethod />
              </DynamicBackground>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderBeforeAfter
