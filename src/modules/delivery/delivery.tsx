import { FC, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'

import styles from './delivery.module.scss'
import { DeliveryProps } from './delivery.types'
import { ButtonWave } from '@/ui'
import { FormModal } from '../formModal'

const Delivery: FC<DeliveryProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <FormModal
        open={isOpen}
        onClose={() => setOpen(false)}
        title="Оставьте заявку на расчёт"
        text="Выберите метод (DTF/UV DTF), укажите носитель — наш менеджер свяжется с вами в течение 15 минут."
      />
      <div className={rootClassName}>
        <div className={styles.media}>
          <Image src="/images/dostavka.png" alt="" width={420} height={260} className={styles.image} priority />
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
            <ButtonWave variant="accent2" onClick={() => { if (typeof window !== 'undefined') window.location.href = '#request'; setOpen(true)}}>
              Оставить заявку
            </ButtonWave>
          </div>
        </div>
      </div>
    </>
  )
}

export default Delivery
