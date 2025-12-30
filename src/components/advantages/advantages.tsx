'use client'

import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './advantages.module.scss'
import { AdvantagesProps } from './advantages.types'
import Image from 'next/image'
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
  classBlock,
  imageSrc1,
  imageSrc2
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.right : null
  )

  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const root = containerRef.current
    if (!root) return

    // Проверка готовности DOM (особенно важно для Vercel)
    const initAnimation = () => {
      // Get all items
      const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.item}`))

      if (items.length === 0) {
        // Retry if items not ready yet
        requestAnimationFrame(initAnimation)
        return
      }

      // Проверка, что элементы имеют размеры (важно для Vercel)
      const rect = root.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        requestAnimationFrame(initAnimation)
        return
      }

      // Preserve CSS "rotate" (individual transform property) from styles like :nth-child(...)
      const getCssRotateDeg = (el: HTMLElement): number => {
        const rotate = getComputedStyle(el).rotate
        if (!rotate || rotate === 'none') return 0
        const n = Number.parseFloat(rotate)
        return Number.isFinite(n) ? n : 0
      }

      const endRotates = items.map(getCssRotateDeg)

      // Calculate end based on number of items for proper pin spacing
      const itemCount = items.length
      const endValue = itemCount * 300 // 300px per item for smooth animation

      const getStartEnd = () => {
        const prev = ScrollTrigger.getById('whatIsPin')
        const prevEnd = prev && Number.isFinite(prev.end) ? prev.end : null
        // "Correct" start is when this section's top reaches the top of the viewport.
        // When WhatIs is pinned, we additionally must not start before its end.
        // Используем более надежный способ получения позиции
        const rect = root.getBoundingClientRect()
        const scrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0
        const absTop = rect.top + scrollY
        const start = prevEnd != null ? Math.max(prevEnd, absTop) : absTop
        return { start, end: start + endValue }
      }

      // Explicit initial state (so cards don't appear "already laid out" before the scrub starts)
      // Используем force3D для аппаратного ускорения
      gsap.set(items, {
        willChange: 'transform, opacity',
        x: 800,
        rotate: (i: number) => (endRotates[i] ?? 0) + 12,
        opacity: 0,
        force3D: true,
        transformOrigin: 'center center',
      })

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // Start only after WhatIs pin completes (prevents "halfway" overlap).
          start: () => getStartEnd().start,
          end: () => getStartEnd().end,
          scrub: 1.5, // Увеличено для более плавной анимации
          pin: true,
          pinSpacing: true,
          anticipatePin: 1, // Предсказание pin для лучшей производительности
          invalidateOnRefresh: true,
          refreshPriority: 1,
          // Обработка refresh для Vercel
          onRefresh: () => {
            // Обновляем начальное состояние при refresh
            gsap.set(items, {
              x: 800,
              rotate: (i: number) => (endRotates[i] ?? 0) + 12,
              opacity: 0,
              force3D: true,
            })
          }
        }
      })

      // Animate items from right
      tl.to(items, {
        x: 0,
        rotate: (i: number) => endRotates[i] ?? 0,
        opacity: 1,
        stagger: 0.8,
        ease: 'power2.out',
        duration: 2.5,
        overwrite: 'auto',
        force3D: true,
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    }

    // Задержка инициализации для Vercel (дает время на полную загрузку)
    let cleanupFn: (() => void) | null | undefined = null
    const timeoutId = setTimeout(() => {
      cleanupFn = initAnimation()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (cleanupFn) cleanupFn()
    }
  }, { scope: containerRef, dependencies: [arrAdvantages, title], revertOnUpdate: true })

  return (
    <div className={rootClassName} ref={containerRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.bg_image}>
          <Image
            width={200}
            height={200}
            quality={90}
            src={imageSrc1}
            alt=''
            className={styles.image}
          />
          <Image
            width={200}
            height={200}
            quality={90}
            src={imageSrc2}
            alt=''
            className={styles.image2}
          />
        </div>
      </div>
      <ul className={styles.list}>
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
