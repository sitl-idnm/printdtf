import { FC } from 'react'
import classNames from 'classnames'

import styles from './finalOffer.module.scss'
import { FinalOfferProps } from './finalOffer.types'
import Form from '@/components/form/form'

const FinalOffer: FC<FinalOfferProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <section className={rootClassName}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h2 className={styles.title}>Готовы обсудить макет?</h2>
          <p className={styles.text}>
            Выберите метод (DTF/UV DTF), прикрепите файл и укажите носитель — наш менеджер
            свяжется с вами в течение 15 минут.
          </p>
        </div>
        <div className={styles.right}>
          <Form submitLabel="Отправить заявку" />
        </div>
      </div>
    </section>
  )
}

export default FinalOffer
