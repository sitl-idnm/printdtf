'use client'
import { FC, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'

import styles from './marketplaces.module.scss'
import { MarketplacesProps } from './marketplaces.types'

// Логотипы маркетплейсов
function IconWildberries() {
  return (
    <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" fill="none">
      <g fill="none" strokeWidth="4.42227" strokeDasharray="none">
        <path
          fill="none"
          d="m4.955 18.904 6.492 23.921 6.957-23.924 8.105 24.052 6.52-24.044m26.467 17.419c0 2.064-.736 3.779-2.238 5.145-1.503 1.366-3.27 2.064-5.45 2.064h-10.93V18.333h10.134c2.092 0 3.859.698 5.302 2.006 1.474 1.337 2.181 2.994 2.181 4.971 0 2.21-.884 3.895-2.592 5.146 2.238 1.162 3.593 3.255 3.593 5.872z"
          fillOpacity="none"
          stroke="purple"
          strokeWidth="4.42227"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="none"
          strokeOpacity="1"
          transform="translate(8.553 12.056) scale(2.71356)"
        />
        <path
          d="M56.118 30.375H41.623"
          fill="none"
          fillOpacity="1"
          stroke="purple"
          strokeWidth="4.42227"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="5"
          strokeDasharray="none"
          strokeOpacity="1"
          transform="translate(8.553 12.056) scale(2.71356)"
        />
      </g>
    </svg>
  )
}

function IconOzon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
      <path fill="#2962ff" d="M13.5,6h21c4.142,0,7.5,3.358,7.5,7.5v21c0,4.142-3.358,7.5-7.5,7.5h-21C9.358,42,6,38.642,6,34.5	v-21C6,9.358,9.358,6,13.5,6z"></path><path fill="#fff" d="M21.499,26.087h-2.573l3.285-4.346c0.072-0.095,0.052-0.235-0.044-0.306 c-0.036-0.028-0.084-0.044-0.131-0.044h-4.752c-0.418,0-0.759,0.342-0.759,0.759s0.342,0.759,0.759,0.759h2.135l-3.296,4.35 c-0.076,0.095-0.056,0.231,0.04,0.306c0.04,0.032,0.087,0.048,0.135,0.044h5.197c0.418-0.02,0.74-0.378,0.72-0.799 c-0.02-0.39-0.33-0.7-0.72-0.72v-0.004H21.499z M38.104,21.391c-0.418,0-0.759,0.342-0.759,0.759v2.549l-4.104-3.257 c-0.091-0.076-0.231-0.064-0.306,0.032c-0.032,0.04-0.048,0.087-0.048,0.139v5.237c0,0.418,0.342,0.759,0.759,0.759 s0.759-0.338,0.759-0.759v-2.549l4.104,3.261c0.095,0.076,0.235,0.06,0.31-0.036c0.032-0.04,0.048-0.087,0.048-0.135V22.15 C38.864,21.729,38.526,21.391,38.104,21.391 M27.245,26.23c-1.738,0-3.034-0.915-3.034-1.734c0-0.819,1.3-1.734,3.034-1.734 c1.738,0,3.034,0.915,3.034,1.734C30.279,25.315,28.986,26.23,27.245,26.23 M27.245,21.243c-2.513,0-4.553,1.455-4.553,3.253 s2.04,3.253,4.553,3.253s4.553-1.455,4.553-3.253S29.758,21.243,27.245,21.243 M12.297,26.234c-0.958,0-1.738-0.775-1.738-1.734 s0.775-1.738,1.734-1.738s1.738,0.775,1.738,1.734V24.5C14.031,25.455,13.256,26.23,12.297,26.234 M12.297,21.243 c-1.797,0-3.253,1.455-3.257,3.253c0,1.797,1.455,3.253,3.253,3.257c1.797,0,3.253-1.455,3.257-3.253v-0.004 C15.546,22.699,14.091,21.243,12.297,21.243"></path>
    </svg>
  )
}

function IconYandexMarket() {
  return (
    <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" fill="none">
      <defs>
        <clipPath id="yandex-market-clip" clipPathUnits="userSpaceOnUse">
          <path fill="#fed42b" d="M50.142 95.224c8.3 0 15-6.7 15-15s-6.7-15-15-15-15 6.7-15 15c-.1 8.3 6.7 15 15 15z" />
        </clipPath>
      </defs>
      <path
        d="m42.742 73.424-13.2 17.3 3.5 4 9.8-13-1 7.1 5.5 1.9 6.7-10.7c-.3 2-.8 6.6 3.6 8 6.9 2.1 12.9-10.3 15.7-16.6l-4-2.1c-3.1 6.5-7.9 13.7-9.8 13.2-1.9-.5-.2-6.6.9-10.5v-.1l-6.1-2.1-7.3 11.9 1-6.5z"
        clipPath="url(#yandex-market-clip)"
        fill="none"
        fillOpacity="1"
        stroke="#fed42b"
        strokeWidth="2.25004"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="none"
        strokeOpacity="1"
        transform="matrix(5.33314 0 0 5.33333 -171.414 -339.797)"
      />
    </svg>
  )
}

const MARKETPLACES = [
  { name: 'Wildberries', icon: IconWildberries },
  { name: 'Ozon', icon: IconOzon },
  { name: 'Яндекс.Маркет', icon: IconYandexMarket }
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
