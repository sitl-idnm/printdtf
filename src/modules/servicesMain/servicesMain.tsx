import { FC } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

import styles from './servicesMain.module.scss'
import { ServicesMainProps } from './servicesMain.types'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const defaultImages = [
  '/images/fotbolka.png',
  '/images/chehol.png',
  '/images/dostavka.png',
]

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
        {items.map((item, idx) => {
          const imageSrc: string = ('image' in item && typeof (item as { image?: string }).image === 'string')
            ? (item as { image: string }).image
            : (defaultImages[idx] || defaultImages[0])
          return (
            <Link
              key={item.href ?? `${item.title}-${idx}`}
              href={item.href ?? '#'}
              className={styles.card}
              data-variant={idx + 1}
              aria-label={item.title}
            >
              <div className={styles.cardImage}>
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx === 0}
                />
              </div>
              <span className={styles.cardInner}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.cta}>
                  Подробнее <span className={styles.ctaIcon}><ArrowIcon /></span>
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default ServicesMain
