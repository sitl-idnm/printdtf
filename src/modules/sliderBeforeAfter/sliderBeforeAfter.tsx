'use client'
import { FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import styles from './sliderBeforeAfter.module.scss'
import { SliderBeforeAfterProps } from './sliderBeforeAfter.types'
import { Advantages } from '@/components'
import { useSetAtom, useAtomValue } from 'jotai'
import { printMethodWriteAtom, printMethodReadAtom } from '@atoms/printMethodAtom'
import { WhatIs } from '../whatIs'
import { PlusWork } from '../plusWork'
import { Cases } from '../cases'
import { Gallery } from '../gallery'
import { Production } from '../production'
import { FinalOffer } from '../finalOffer'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  num: 'Печать на любой ткани', text: 'нет ограничений по составу и цвету материала.'
}, {
  num: 'Идеально для малых тиражей', text: 'выгодно заказывать даже от 1 штуки.'
}, {
  num: 'Доступная цена', text: 'низкая себестоимость делает печать экономически выгодной.'
}, {
  num: 'Высокая износостойкость', text: 'изображение выдерживает многочисленные стирки, не трескается и не выцветает.'
}, {
  num: 'Мягкое и эластичное нанесение', text: 'принт не ощущается на ткани и не стесняет движения.'
}, {
  num: 'Яркие цвета и детализация ', text: ' белая подложка гарантирует сочные цвета даже на темных изделиях.'
}, {
  num: 'Прочность сцепления', text: ' изображение устойчиво к растяжению и механическим воздействиям.'
}]

const advantagesUVDTF = [{
  num: 'Печать на любых твёрдых поверхностях', text: 'от пластика до стекла и металла.'
}, {
  num: 'Идеально для микротиражей', text: 'экономически выгодно производить даже один экземпляр.'
}, {
  num: 'Высокая детализация и глянец', text: 'фотографическое качество изображения с эффектной, яркой поверхностью.'
}, {
  num: 'Максимальная износостойкость', text: 'декор устойчив к влаге, истиранию, ультрафиолету и агрессивным средам.'
}, {
  num: 'Готовые переводные стикеры', text: 'полученное изображение представляет собой готовую, гибкую наклейку, которую легко переносить.'
}, {
  num: 'Скорость производства', text: 'процесс печати и полимеризации происходит очень быстро.'
}, {
  num: 'Эффект объёмного 3D', text: 'возможность многослойного нанесения для создания тактильной рельефной поверхности.'
}]

const SliderBeforeAfter: FC<SliderBeforeAfterProps> = ({
  className,
  // before,
  // after,
  // beforeLabel = 'Before',
  // afterLabel = 'After',
  // initial = 0.5,
}) => {
  const rootClassName = classNames(styles.root, className)

  const [currentSlide, setCurrentSlide] = useState<number>(1)

  const setPrintMethod = useSetAtom(printMethodWriteAtom)
  const printMethod = useAtomValue(printMethodReadAtom)
  const navigationRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPrintMethod('dtf')
  }, [setPrintMethod])

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
  }, { scope: rootRef })

  const [isCollapsing, setIsCollapsing] = useState(false)
  const isDTF = currentSlide === 1
  const collapseMs = 700
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      // cleanup timers on unmount
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  function handleSwitch(target: 1 | 2, method: 'dtf' | 'uvdtf') {
    if (currentSlide === target || isCollapsing) return
    setIsCollapsing(true)
    // 1) полностью схлопываем
    timersRef.current.push(
      window.setTimeout(() => {
        // 2) меняем контент, пока высота = 0
        setCurrentSlide(target)
        setPrintMethod(method)
        // 3) даём кадр на рефлоу, затем раскрываем
        timersRef.current.push(
          window.setTimeout(() => setIsCollapsing(false), 16)
        )
      }, collapseMs)
    )
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
        <div>
          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <WhatIs
                title={isDTF ? 'DTF-печать' : 'UV DTF-печать: стойкий декор для любых поверхностей'}
                arrWhat={isDTF ? whatDTF : whatUVDTF}
              />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <Advantages
                arrAdvantages={isDTF ? advantagesDTF : advantagesUVDTF}
                title={
                  isDTF
                    ? <><span>Преимущества</span><span>DTF</span></>
                    : <><span>Преимущества</span><span>UV-DTF</span></>
                }
                imageSrc='/images/123.jpg'
              />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <PlusWork arrPlusWork={isDTF ? StagesDTFArray : StagesUVDTFArray} />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <Production
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
                videoSrc={isDTF ? '/videos/6.mp4' : ''}
              />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <Gallery
                title="ПОРТФОЛИО"
                description="Откройте полноэкранный просмотр, чтобы рассмотреть текстуру принта/рельеф."
                items={[
                  { id: 1, image: '/images/test.jpg', title: 'Футболки' },
                  { id: 2, image: '/images/test.jpg', title: 'UV на стекле' },
                  { id: 3, image: '/images/test.jpg', title: 'Чехлы' },
                  { id: 4, image: '/images/test.jpg', title: 'Кружки' },
                  { id: 5, image: '/images/test.jpg', title: 'Кружки' },
                  { id: 6, image: '/images/test.jpg', title: 'Кружки' }
                ]}
              />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <Cases
                items={[
                  {
                    id: 'sber',
                    kicker: 'Сбер',
                    type: 'UV DTF',
                    title: 'Стикерпаки',
                    meta: '120 м, 3500 шт, плоттерная резка, 5 дней; тестовая печать для согласования цветов.',
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'ducks',
                    kicker: '—',
                    type: 'UV DTF',
                    title: 'Корпоративные уточки',
                    meta: 'Нанесение на резиновых уточек 50 шт (20 см), печать + перенос — 3 дня.',
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'lukoil',
                    kicker: 'ЛУКОЙЛ',
                    type: 'DTF',
                    title: 'Печать на футболках',
                    meta: '1000 шт — 2 дня, печать + перенос + упаковка.',
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'mossport',
                    kicker: 'Мосспорт',
                    type: 'DTF',
                    title: 'Нанесение на блокноты',
                    meta: '2000 наборов — 1 сутки.',
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'fix',
                    kicker: 'Клиент (NDA)',
                    type: 'DTF',
                    title: 'Исправление заказа',
                    meta: '5000 изделий — 4 дня.',
                    image: '/images/notebook.png'
                  },
                  {
                    id: 'van',
                    kicker: 'PrintDTF',
                    type: 'UV DTF',
                    title: 'Печать и поклейка авто',
                    meta: 'Сделали печать и поклейку собственного авто — как пример нашей заморочки и возможностей.',
                    image: '/images/notebook.png'
                  }
                ].filter((item) => (isDTF ? item.type === 'DTF' : item.type === 'UV DTF'))}
              />
            </div>
          </div>

          <div className={`${styles.section} ${!isCollapsing ? styles.sectionOpen : ''}`}>
            <div className={styles.sectionInner}>
              <FinalOffer useAtomPrintMethod />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderBeforeAfter
