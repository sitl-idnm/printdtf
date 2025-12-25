'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './keyAdvantages.module.scss'
import { KeyAdvantagesProps } from './keyAdvantages.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconSpark() {
  return (
    <svg className={styles.spark} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l1.3 5.1L18 8.4l-4.7 1.3L12 15l-1.3-5.3L6 8.4l4.7-1.3L12 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M4 14l.7 2.5L7 17l-2.3.6L4 20l-.7-2.4L1 17l2.3-.5L4 14Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 13l.7 2.5L23 16l-2.3.6L20 19l-.7-2.4L17 16l2.3-.5L20 13Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

const KeyAdvantages: FC<KeyAdvantagesProps> = ({ className, title, subtitle, items, note }) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLElement | null>(null)

  const data = useMemo(() => (items ?? []).filter(Boolean), [items])

  useGSAP(() => {
    const root = rootRef.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`))
    const noteEl = root.querySelector<HTMLElement>(`.${styles.note}`)
    const blocks = noteEl ? [...cards, noteEl] : cards
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

    tl.to(cards, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.12,
      onStart: () => cards.forEach((c) => c.classList.add(styles.inView))
    })

    if (noteEl) {
      tl.to(noteEl, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
        onStart: () => noteEl.classList.add(styles.inView)
      }, '>-0.1')
    }

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: rootRef, dependencies: [data.length, Boolean(note)] })

  return (
    <section className={rootClassName} aria-label={title} ref={rootRef}>
      <header className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      <div className={styles.grid}>
        {data.map((it, idx) => (
          <article className={styles.card} key={idx}>
            <div className={styles.top}>
              <div className={styles.badge}>
                <span className={styles.num}>{String(idx + 1).padStart(2, '0')}</span>
                преимущество
              </div>
              <IconSpark />
            </div>
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.text}>{it.text}</p>
          </article>
        ))}
      </div>

      {note ? (
        <div className={styles.note}>
          <p className={styles.noteTitle}>Отдельно про «Честный Знак»</p>
          <p className={styles.noteText}>{note}</p>
        </div>
      ) : null}
    </section>
  )
}

export default KeyAdvantages

