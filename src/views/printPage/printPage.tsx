import { FC } from 'react'
import classNames from 'classnames'

import styles from './printPage.module.scss'
import { PrintPageProps } from './printPage.types'
import { PrintHero } from '@/modules/printHero'
import { SliderBeforeAfter } from '@/modules/sliderBeforeAfter'

const PrintPage: FC<PrintPageProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <PrintHero
        title={<><span>DTF и UV DTF печать&nbsp;—</span><span>от 1 дня, от 1 экземпляра</span></>}
        subtitle={'DTF — полноцветная печать на готовых изделиях. UV DTF — наклейки/стикерпаки для стекла, пластика, металла. Тестовый образец — бесплатно. Печать с переносом или без — на ваш выбор'}
        // cta1={'Рассчитать стоимость'}
        // cta2={'Написать в WhatsApp'}
        microtext={'Наш менеджер свяжется с вами в течение 15 минут'}
        option={'Средний срок изготовления: 1–3 рабочих дня. Срочные — по запросу.'}
      />
      <SliderBeforeAfter />
    </main>
  )
}

export default PrintPage
