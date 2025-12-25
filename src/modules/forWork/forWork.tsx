'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'

import styles from './forWork.module.scss'
import { ForWorkProps } from './forWork.types'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Иконки для ForWork
function IconStore() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7v13M9 7v13M14 7v13M19 7v13M2 7h20M2 4h20" />
      <path d="M6 7V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3" />
    </svg>
  )
}

function IconWarehouse() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16v8H4V7Z" />
      <path d="M3 14h18" />
      <path d="M5 14v6M12 14v6M19 14v6" />
      <path d="M8 10h8M8 12h8" />
    </svg>
  )
}

const DEFAULT_ICONS = [IconStore, IconWarehouse]

const ForWork: FC<ForWorkProps> = ({
  className,
  title,
  textArr
}) => {
  const rootClassName = classNames(styles.root, className)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const items = useMemo(() => (textArr ?? []).filter(Boolean), [textArr])

  useGSAP(() => {
    const root = gridRef.current
    if (!root) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`))
    if (!cards.length) return

    if (prefersReduced) {
      gsap.set(cards, { clearProps: 'all' })
      return
    }

    gsap.set(cards, { opacity: 0, y: 44, filter: 'blur(6px)' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true
      }
    })

    tl.to(cards, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.12
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: gridRef, dependencies: [items.length] })

  return (
    <div className={rootClassName}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid} ref={gridRef}>
        {items.map((item, index) => {
          const Icon = DEFAULT_ICONS[index] ?? DEFAULT_ICONS[0]
          return (
            <article key={index} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.icon}>
                  <Icon />
                </div>
                <p className={styles.text}>{item.text}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default ForWork
