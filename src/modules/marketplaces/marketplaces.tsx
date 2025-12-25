'use client'
import { FC, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'

import styles from './marketplaces.module.scss'
import { MarketplacesProps } from './marketplaces.types'

// Логотипы маркетплейсов
function IconWildberries() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="#970EFF"/>
      <path d="M100 50L130 90H110L100 75L90 90H70L100 50Z" fill="white"/>
      <path d="M70 90V150H90V120H110V150H130V90H70Z" fill="white"/>
    </svg>
  )
}

function IconOzon() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="#005BFF"/>
      <path d="M100 60L140 100L100 140L60 100L100 60Z" fill="white"/>
      <circle cx="100" cy="100" r="20" fill="#005BFF"/>
    </svg>
  )
}

function IconYandexMarket() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="#FC3F1D"/>
      <path d="M80 70L120 70L100 100L80 70Z" fill="white"/>
      <rect x="80" y="100" width="40" height="30" fill="white"/>
      <path d="M80 130L100 150L120 130H80Z" fill="white"/>
    </svg>
  )
}

function IconSberMarket() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="24" fill="#21A038"/>
      <path d="M70 80L100 50L130 80V130H100V100H80V130H70V80Z" fill="white"/>
      <rect x="100" y="120" width="30" height="20" fill="white"/>
    </svg>
  )
}

const MARKETPLACES = [
  { name: 'Wildberries', icon: IconWildberries },
  { name: 'Ozon', icon: IconOzon },
  { name: 'Яндекс.Маркет', icon: IconYandexMarket },
  { name: 'Сбермаркет', icon: IconSberMarket }
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
      const clone2 = item.cloneNode(true) as HTMLElement
      track.appendChild(clone1)
      track.appendChild(clone2)
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
    <section className={rootClassName} aria-label={title || 'Маркетплейсы'}>
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
              <div key={`${marketplace.name}-${index}`} className={styles.item}>
                <div className={styles.iconWrapper}>
                  <Icon />
                </div>
                <span className={styles.name}>{marketplace.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Marketplaces
