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

// Иконки для преимуществ (из Heroicons)
function IconCurrencyDollar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconChatBubbleLeftRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
    </svg>
  )
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function IconShieldCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconCog6Tooth() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
    </svg>
  )
}

const ADVANTAGE_ICONS = [
  IconCurrencyDollar,  // Честный прайс
  IconStar,            // Качественный сервис
  IconChatBubbleLeftRight, // Клиентская поддержка
  IconTrophy,          // Опыт селлеров
  IconShieldCheck,     // Экспертиза в Честном Знаке
  IconCog6Tooth        // Оптимизация процессов
]

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
        {data.map((it, idx) => {
          const Icon = ADVANTAGE_ICONS[idx] || IconCurrencyDollar
          return (
            <article className={styles.card} key={idx}>
              <div className={styles.top}>
                <div className={styles.badge}>
                  <span className={styles.iconWrapper}>
                    <Icon />
                  </span>
                  преимущество
                </div>
                <IconSpark />
              </div>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.text}>{it.text}</p>
            </article>
          )
        })}
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
