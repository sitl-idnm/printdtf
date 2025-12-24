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
          arrAdvantages?.map((item, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.number}>
                {item.num}
              </p>
              <p className={styles.text}>
                {item.text}
              </p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Advantages
