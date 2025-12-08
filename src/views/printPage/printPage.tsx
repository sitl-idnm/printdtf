'use client'
import { FC, useState } from 'react'
import classNames from 'classnames'

import styles from './printPage.module.scss'
import { PrintPageProps } from './printPage.types'
import { PrintHero } from '@/modules/printHero'
import { SliderBeforeAfter } from '@/modules/sliderBeforeAfter'
import { Printitems } from '@/modules/printitems'
import textileItems from '@/modules/printitems/presets/textile'
import { PrintOptions } from '@/modules/printOptions'
import { Faq } from '@/modules/faq'
import { ButtonWave, Separator } from '@/ui'
import { printMethodReadAtom } from '@/shared/atoms/printMethodAtom'
import { useAtomValue } from 'jotai'
import { Process } from '@/modules/process'
import { FinalOfferAlt } from '@/modules/finalOfferAlt'
import { FinalOffer } from '@/modules/finalOffer'
import { FormModal } from '@/modules/formModal'
import { MaketRequirments } from '@/modules/maketRequirments'
import { PriceList } from '@/modules/priceList'
import { Delivery } from '@/modules/delivery'

const printIcons = [
  '/images/sticker-dino.png',
  '/images/sticker-shark.png',
  '/icons/logo.svg',
  '/images/favicon/shark-fav.svg'
]

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

const PrintPage: FC<PrintPageProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const [isOpen, setOpen] = useState(false)
  const dtfvalue = useAtomValue(printMethodReadAtom)

  return (
    <main className={rootClassName}>
      <FormModal
          open={isOpen}
          onClose={() => setOpen(false)}
          title="Оставьте заявку на расчёт"
        text="Выберите метод (DTF/UV DTF), укажите носитель — наш менеджер свяжется с вами в течение 15 минут."

        />
      <PrintHero
        title={<><span>DTF и UV DTF</span></>}
        subtitle={'Делаем как срочные тиражи фирменного мерча для бизнеса, так и единичные креативные вещи. DTF и UV DTF печать для любых задач и любого бюджета.'}
        // cta1={'Рассчитать стоимость'}
        // cta2={'Написать в WhatsApp'}

        microtext={'Наш менеджер свяжется с вами в течение 15 минут'}
        option={'Средний срок изготовления: 1–3 рабочих дня. Срочные — по запросу.'}
      />

      {
        dtfvalue === 'dtf' ?
        <Separator
          fromColor={'var(--color-accent-1)'}
          toColor={'var(--color-background)'}
          height='40px'
          angle={'180deg'}
        /> :
        <Separator
          fromColor={'var(--color-accent-1)'}
          toColor={'black'}
          height='40px'
          angle={'180deg'}
        />
      }

      <SliderBeforeAfter />
      <Separator
        fromColor={'black'}
        toColor={'var(--color-accent-3)'}
        height='40px'
        angle={'180deg'}
      />
      <Printitems
          icons={printIcons ?? [
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg',
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg'
          ]}
          items={textileItems}
          visibleCorners={['bottomRight']}
      />
      <Separator
          fromColor={'var(--color-accent-3)'}
          toColor={'white'}
          height='40px'
          angle={'180deg'}
        />
      <FinalOfferAlt /><ButtonWave variant="accent3" onClick={() => setOpen(true)}><span>Заказать печать</span></ButtonWave>
      <PrintOptions />
      <Process />
      <PriceList />
      <Delivery />
      <MaketRequirments />
      <Faq faqData={faqData} />
      <FinalOffer />
    </main>
  )
}

export default PrintPage
