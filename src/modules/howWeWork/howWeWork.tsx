'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './howWeWork.module.scss'
import { HowWeWorkProps } from './howWeWork.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconFlow() {
  return (
    <svg className={styles.tagIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 6c0 4 10 2 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const HowWeWork: FC<HowWeWorkProps> = ({ className, title, subtitle, steps }) => {
  const rootClassName = classNames(styles.root, className)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const data = useMemo(() => (steps ?? []).filter(Boolean), [steps])

  useGSAP(() => {
    const root = wrapRef.current
    if (!root) return

    const rows = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.step}`))
    if (!rows.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      rows.forEach((c) => c.classList.add(styles.inView))
      return
    }

    gsap.set(rows, { opacity: 0, y: 18, filter: 'blur(6px)' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true
      }
    })

    tl.to(rows, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.1,
      onStart: () => rows.forEach((c) => c.classList.add(styles.inView))
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: wrapRef, dependencies: [data.length] })

  return (
    <section className={rootClassName} aria-label={title}>
      <header className={styles.head}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.tag}>
            <IconFlow />
            сценарий
          </div>
        </div>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      <div className={styles.wrap} ref={wrapRef}>
        <div className={styles.rail} aria-hidden="true" />
        {data.map((s, idx) => (
          <article className={styles.step} key={idx}>
            <div className={styles.badge} aria-hidden="true">
              <span className={styles.num}>{String(idx + 1).padStart(2, '0')}</span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.text}>{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HowWeWork
