import { FC } from 'react'
import classNames from 'classnames'

import styles from './servicesMain.module.scss'
import { ServicesMainProps } from './servicesMain.types'

const ServicesMain: FC<ServicesMainProps> = ({
  className,
  items = [
    { title: 'Печать', href: '/print' },
    { title: 'Фулфилмент', href: '/fullfilment' },
    { title: 'Логистика', href: '/logistika' },
  ],
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <section className={rootClassName} aria-label="Основные услуги">
      <div className={styles.row}>
        {items.map((item, idx) => (
          <a key={idx} href={item.href ?? '#'} className={styles.card}>
            <span className={styles.title}>{item.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ServicesMain
