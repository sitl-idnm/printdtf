'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './whoWeAre.module.scss'
import { WhoWeAreProps } from './whoWeAre.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconClipboardCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function IconShieldCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 10l9 4 9-4v7l-9 4-9-4v-7z" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
      <path d="M12 7l8 4M12 7L4 11" />
    </svg>
  )
}

function IconCheckSquare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

const LIST_ICONS = [
  IconCheckCircle,
  IconClipboardCheck,
  IconShieldCheck,
  IconBox,
  IconPackage,
  IconCheckSquare,
  IconStar
]

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
            {data.map((it, idx) => {
              const Icon = LIST_ICONS[idx % LIST_ICONS.length]
              return (
                <li className={styles.item} key={idx}>
                  <div className={styles.icon} aria-hidden="true">
                    <Icon />
                  </div>
                  <p className={styles.text}>{it.text}</p>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default WhoWeAre
