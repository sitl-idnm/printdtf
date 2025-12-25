'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './whoWeAre.module.scss'
import { WhoWeAreProps } from './whoWeAre.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7 10.5 16.5 4 10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const WhoWeAre: FC<WhoWeAreProps> = ({ className, title, brand, lead, paragraphs, asideKicker = 'мы берём на себя', asideAriaLabel = 'Что берём на себя', items }) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLElement | null>(null)

  const body = useMemo(() => (paragraphs ?? []).filter(Boolean), [paragraphs])
  const data = useMemo(() => (items ?? []).filter(Boolean), [items])

  useGSAP(() => {
    const root = rootRef.current
    if (!root) return

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.fadeIn}`))
    if (!blocks.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      blocks.forEach((b) => b.classList.add(styles.inView))
      return
    }

    gsap.set(blocks, { opacity: 0, y: 18, filter: 'blur(6px)' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true
      }
    })

    tl.to(blocks, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.12,
      onStart: () => blocks.forEach((b) => b.classList.add(styles.inView))
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: rootRef, dependencies: [data.length, body.length] })

  return (
    <section className={rootClassName} aria-label={title} ref={rootRef}>
      <div className={styles.grid}>
        <div className={classNames(styles.left, styles.fadeIn)}>
          <h2 className={styles.title}>
            {title}{' '}
            {brand ? (
              <>
                <span className={styles.brand}>— {brand}</span>
              </>
            ) : null}
          </h2>

          <p className={styles.lead}>{lead}</p>

          {body.map((p, idx) => (
            <p className={styles.p} key={idx}>
              {p}
            </p>
          ))}
        </div>

        <aside className={classNames(styles.rightCard, styles.fadeIn)} aria-label={asideAriaLabel}>
          <div className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" />
            {asideKicker}
          </div>
          <ul className={styles.list}>
            {data.map((it, idx) => (
              <li className={styles.item} key={idx}>
                <div className={styles.icon} aria-hidden="true">
                  <IconCheck />
                </div>
                <p className={styles.text}>{it.text}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default WhoWeAre
