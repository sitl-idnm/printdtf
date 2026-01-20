'use client'
import { FC, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'

import styles from './marketplaces.module.scss'
import { MarketplacesProps } from './marketplaces.types'
import IconWildberries from '@icons/wb.svg'
import IconOzon from '@icons/ozon.svg'
import IconYandexMarket from '@icons/yandexmarket.svg'

const MARKETPLACES = [
  { icon: IconWildberries },
  { icon: IconOzon },
  { icon: IconYandexMarket }
]

const Marketplaces: FC<MarketplacesProps> = ({ className, title }) => {
  const rootClassName = classNames(styles.root, className)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) return

    // Создаем дубликаты для бесконечной прокрутки
    const items = Array.from(track.children) as HTMLElement[]
    if (!items.length) return

    // Клонируем все элементы дважды для бесшовной прокрутки
    items.forEach((item) => {
      const clone1 = item.cloneNode(true) as HTMLElement
      track.appendChild(clone1)
    })

    items.forEach((item) => {
      const clone1 = item.cloneNode(true) as HTMLElement
      track.appendChild(clone1)
    })

    items.forEach((item) => {
      const clone1 = item.cloneNode(true) as HTMLElement
      track.appendChild(clone1)
    })

    // Вычисляем ширину одного набора элементов
    const gap = 32 // gap между элементами
    const singleSetWidth = items.reduce((sum, item) => {
      return sum + (item as HTMLElement).offsetWidth + gap
    }, 0)

    // Анимация бесконечной прокрутки
    const duration = 30 // Скорость прокрутки (секунды)

    const animation = gsap.to(track, {
      x: -singleSetWidth,
      duration: duration,
      ease: 'none',
      repeat: -1
    })

    return () => {
      animation.kill()
    }
  }, [])

  return (
    <section className={rootClassName} aria-label={typeof title === 'string' ? title : 'Маркетплейсы'}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.container} ref={containerRef}>
        <div className={styles.track} ref={trackRef}>
          {MARKETPLACES.map((marketplace, index) => {
            const Icon = marketplace.icon
            return (
              <div key={`${marketplace.icon}-${index}`} className={styles.item}>
                <div className={styles.iconWrapper}>
                  <Icon />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Marketplaces
