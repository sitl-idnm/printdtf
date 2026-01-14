'use client'

import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './advantages.module.scss'
import { AdvantagesProps } from './advantages.types'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Иконки для преимуществ (логистика)
function IconMarketplace() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
      <path d="M7 12h10" />
      <path d="M12 2v10" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  )
}

function IconBoxes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16v8H4V7Z" />
      <path d="M3 14h18" />
      <path d="M5 14v6M12 14v6M19 14v6" />
      <path d="M8 10h8M8 12h8" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function IconDollar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

const DEFAULT_ICONS = [IconMarketplace, IconCalendar, IconBoxes, IconClock, IconDollar]

const Advantages: FC<AdvantagesProps> = ({
  className,
  arrAdvantages,
  title,
  classBlock
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.right : null
  )

  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const root = containerRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.item}`))
    if (items.length === 0) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      items.forEach((item) => {
        gsap.set(item, { opacity: 1, y: 0 })
      })
      return
    }

    // Устанавливаем начальное состояние - карточки невидимы и немного смещены вниз
    gsap.set(items, {
      opacity: 0,
      y: 30,
      force3D: true,
    })

    // Создаём ScrollTrigger анимацию для плавного появления
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    })

    // Плавное появление карточек с небольшой задержкой между ними
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power1.out',
      force3D: true,
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: containerRef, dependencies: [arrAdvantages, title], revertOnUpdate: true })

  const itemsCount = arrAdvantages?.length || 0

  return (
    <div className={rootClassName} ref={containerRef}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list} data-count={itemsCount}>
        {
          arrAdvantages?.map((item, index) => {
            const Icon = DEFAULT_ICONS[index] || DEFAULT_ICONS[0]
            return (
              <li key={index} className={styles.item}>
                {item.num ? (
                  <h3 className={styles.itemTitle}>{item.num}</h3>
                ) : (
                  <div className={styles.iconWrapper}>
                    {item.icon || <Icon />}
                  </div>
                )}
                <p className={styles.text}>
                  {item.text}
                </p>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Advantages
