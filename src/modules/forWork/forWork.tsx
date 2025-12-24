'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'

import styles from './forWork.module.scss'
import { ForWorkProps } from './forWork.types'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
        {items.map((item, index) => (
          <article key={index} className={styles.card}>
            <div className={styles.cardInner}>
              <p className={styles.text}>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ForWork
