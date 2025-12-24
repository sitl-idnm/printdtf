import { FC } from 'react'
import classNames from 'classnames'

import styles from './fullfilmentPage.module.scss'
import { FullfilmentPageProps } from './fullfilmentPage.types'
import { PrintHero } from '@/modules/printHero'

const FullfilmentPage: FC<FullfilmentPageProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <PrintHero
        title={<><span>City Group — фулфилмент для маркетплейсов в Москве и МО</span></>}
        subtitle={<>Берём на себя логистику до маркетплейсов для селлеров и фулфилментов: забираем груз, консолидируем, формируем поставки и довозим до нужного склада точно в окно. Работаем по схемам FBO и FBS, закрываем регулярные и разовые отгрузки, чтобы вы не сорвали слот и не зависели от случайных перевозчиков.</>}
        cta1={'Заказать тираж'}
        cta2={'Обсудить индивидуальный заказ'}
      />
    </main>
  )
}

export default FullfilmentPage
