import { FC } from 'react'
import classNames from 'classnames'
import Image from 'next/image'

import styles from './delivery.module.scss'
import { DeliveryProps } from './delivery.types'
import { ButtonWave } from '@/ui'

const Delivery: FC<DeliveryProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <div className={styles.media}>
        <Image src="/images/123.jpg" alt="" width={420} height={260} className={styles.image} priority />
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <div className={styles.title}>Узнать больше о доставке</div>
          <div className={styles.subtitle}>
            Доставляем по всей России. Сроки и стоимость зависят от адреса, перевозчика и тиража.
            Мы подскажем оптимальный вариант под ваши сроки и бюджет.
          </div>
        </div>
        <div className={styles.action}>
          <ButtonWave variant="accent2" onClick={() => { if (typeof window !== 'undefined') window.location.href = '#request' }}>
            Оставить заявку
          </ButtonWave>
        </div>
      </div>
    </div>
  )
}

export default Delivery
