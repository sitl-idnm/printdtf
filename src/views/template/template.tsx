'use client'

import { FC } from 'react'
import classNames from 'classnames'

import styles from './template.module.scss'
import { TemplateProps } from './template.types'
import { Faq } from '@/modules/faq'
import { Printitems } from '@/modules/printitems'
import { Wrapper } from '@/ui/wrapper'
import { Gallery } from '@/modules/gallery'
import { Cases } from '@/modules/cases'
import { PrintOptions } from '@/modules/printOptions'
// import { ViewportSection } from '@/modules/viewportSection'
import textileItems from '@/modules/printitems/presets/textile'
import brandingItems from '@/modules/printitems/presets/branding'
import { ButtonWave } from '@/ui/buttonWave'

const Template: FC<TemplateProps> = ({
  className,
  printIcons,
  printItems
}) => {
  const rootClassName = classNames(styles.root, className)

  const faqData = [
    {
      title: 'Что такое DTF печать?',
      content: 'Технология переноса отпечатка с специальной плёнки на изделие с помощью клеевого слоя и термопресса. Универсальна для текстиля.'
    },
    {
      title: 'Что такое UV DTF печать?',
      content: 'Вариант DTF, где используются УФ-чернила и УФ-засветка вместо термопресса. Позволяет печатать на твёрдых гладких поверхностях.'
    },
    {
      title: 'В чём разница между DTF и UV DTF?',
      content: 'DTF: одежда и текстиль, перенос термопрессом, мягкий и эластичный отпечаток. UV DTF: стекло/пластик/металл/дерево и т.д., засветка УФ-лампой, жёсткий устойчивый отпечаток.'
    },
    {
      title: 'Какие поверхности подходят для DTF?',
      content: 'Хлопковые футболки и толстовки, свитшоты, бейсболки, синтетика и смесовые ткани.'
    },
    {
      title: 'Какие поверхности подходят для UV DTF?',
      content: 'Стекло, пластик, керамика (кружки), дерево, металл, гаджеты (ноутбуки, зажигалки) и прочие гладкие твёрдые поверхности.'
    },
    {
      title: 'Преимущества DTF',
      content: 'Универсальность по тканям, яркость и детализация, эластичность, мягкость отпечатка.'
    },
    {
      title: 'Преимущества UV DTF',
      content: 'Супер-универсальность по материалам (кроме ткани), высокая стойкость к царапинам и влаге, 3D/глянец/матовые эффекты.'
    },
    {
      title: 'Ограничения по размеру и детализации',
      content: 'Ширина печати до 780 мм; при переносе рекомендуемая ширина принта до ~380 мм; детализация не ниже 300 dpi.'
    },
    {
      title: 'Стойкость и долговечность',
      content: 'DTF на одежде: 30–50+ стирок при правильном уходе (30°C, наизнанку). UV DTF на твёрдых поверхностях: очень высокая стойкость к воде и бытовой химии.'
    },
    {
      title: 'Минимальные и максимальные тиражи',
      content: 'Минимальный тираж: от 1 шт. Максимальный: практически не ограничен.'
    },
    {
      title: 'Сроки производства',
      content: 'Малые заказы (1–10 шт.): 1–3 рабочих дня. Крупные партии: по согласованию, зависит от объёма.'
    },
    {
      title: 'Уход за изделиями с DTF / UV DTF',
      content: 'DTF: стирка 30–40°C, наизнанку, без отбеливателей, сушить естественно, гладить с изнанки. UV DTF: особого ухода не требуется; не использовать абразивы/ПММ, если не оговорено.'
    },
    {
      title: 'Доставка',
      content: 'Сроки и стоимость считаются после оформления заказа. Доставка за счёт покупателя: Яндекс, СДЭК и т.д.'
    },
    {
      title: 'Разрабатываете ли дизайн с нуля?',
      content: 'Нет, дизайн не разрабатываем. Поможем подготовить файл под печать и дадим рекомендации.'
    }
  ]

  return (
    <main className={rootClassName}>
      <Wrapper>
        <Printitems
          icons={printIcons ?? [
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg',
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg'
          ]}
          items={printItems ?? textileItems}
          visibleCorners={['bottomRight']}
        />
        {/* <ButtonWave variant="accent3"><span>Заказать печать</span></ButtonWave> */}

        <Gallery
          title="ПОРТФОЛИО"
          description="Откройте полноэкранный просмотр, чтобы рассмотреть текстуру принта/рельеф."
          items={[
            { id: 1, image: '/images/banner.jpg', title: 'Футболки' },
            { id: 2, image: '/images/banner.jpg', title: 'UV на стекле' },
            { id: 3, image: '/images/banner.jpg', title: 'Чехлы' },
            { id: 4, image: '/images/banner.jpg', title: 'Кружки' },
            { id: 5, image: '/images/banner.jpg', title: 'Кружки' },
            { id: 6, image: '/images/banner.jpg', title: 'Кружки' }
          ]}
        />
        <Cases
          items={[
            {
              id: 'sber',
              kicker: 'Сбер',
              type: 'UV DTF',
              title: 'Стикерпаки',
              meta: '120 м, 3500 шт, плоттерная резка, 5 дней; тестовая печать для согласования цветов.',
              image: '/images/sticker-shark.png'
            },
            {
              id: 'ducks',
              kicker: '—',
              type: 'UV DTF',
              title: 'Корпоративные уточки',
              meta: 'Нанесение на резиновых уточек 50 шт (20 см), печать + перенос — 3 дня.',
              image: '/images/sticker-shark.png'
            },
            {
              id: 'lukoil',
              kicker: 'ЛУКОЙЛ',
              type: 'DTF',
              title: 'Печать на футболках',
              meta: '1000 шт — 2 дня, печать + перенос + упаковка.',
              image: '/images/sticker-dino.png'
            },
            {
              id: 'mossport',
              kicker: 'Мосспорт',
              type: 'DTF',
              title: 'Нанесение на блокноты',
              meta: '2000 наборов — 1 сутки.',
              image: '/images/sticker-dino.png'
            },
            {
              id: 'fix',
              kicker: 'Клиент (NDA)',
              type: 'DTF',
              title: 'Исправление заказа',
              meta: '5000 изделий — 4 дня.',
              image: '/images/sticker-dino.png'
            },
            {
              id: 'van',
              kicker: 'PrintDTF',
              type: 'UV DTF',
              title: 'Печать и поклейка авто',
              meta: 'Сделали печать и поклейку собственного авто — как пример нашей заморочки и возможностей.',
              image: '/images/sticker-shark.png'
            }
          ]}
        />
        <PrintOptions />
        <Faq faqData={faqData} />
      </Wrapper>

    </main>
  )
}

export default Template
