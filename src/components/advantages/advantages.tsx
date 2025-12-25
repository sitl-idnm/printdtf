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

// Иконки для преимуществ
function IconLogistics() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10H7V7Z" />
      <path d="M14 10h4l3 3v4h-7v-7Z" />
      <path d="M7 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M18 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
    </svg>
  )
}

function IconSchedule() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  )
}

function IconWarehouse() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16v8H4V7Z" />
      <path d="M3 14h18" />
      <path d="M5 14v6M12 14v6M19 14v6" />
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

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  )
}

const DEFAULT_ICONS = [IconLogistics, IconSchedule, IconWarehouse, IconClock, IconShield]

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

    // Get all items
    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.item}`))

    if (items.length === 0) return

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
      const absTop = root.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
      const start = prevEnd != null ? Math.max(prevEnd, absTop) : absTop
      return { start, end: start + endValue }
    }

    // Explicit initial state (so cards don't appear "already laid out" before the scrub starts)
    gsap.set(items, {
      willChange: 'transform, opacity',
      x: 800,
      rotate: (i: number) => (endRotates[i] ?? 0) + 12,
      opacity: 0,
    })

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        // Start only after WhatIs pin completes (prevents "halfway" overlap).
        start: () => getStartEnd().start,
        end: () => getStartEnd().end,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: 1
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
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
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
            const Icon = DEFAULT_ICONS[index] || IconLogistics
            return (
              <li key={index} className={styles.item}>
                <div className={styles.iconWrapper}>
                  {item.icon || (item.num ? (
                    <p className={styles.number}>
                      {item.num}
                    </p>
                  ) : (
                    <Icon />
                  ))}
                </div>
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
