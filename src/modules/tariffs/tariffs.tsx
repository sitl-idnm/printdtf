'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './tariffs.module.scss'
import { TariffsProps, TariffTone } from './tariffs.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconStamp() {
  return (
    <svg className={styles.stampIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4h10v6l-2 2v2H9v-2l-2-2V4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M6 20h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 20v-2h8v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IconCity() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V10l6-3v13H4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 20V6l10-2v16H10Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 12h0M7 15h0M13 9h0M13 12h0M13 15h0M17 9h0M17 12h0M17 15h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function IconRoad() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h12l-3 20H9L6 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 6v3M12 12v3M12 18v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconRepeat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 7h-6V4l-4 4 4 4V9h6a2 2 0 0 1 2 2v6h-2v-6a0 0 0 0 0 0 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 17h6v3l4-4-4-4v3H4a2 2 0 0 1-2-2V7h2v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ICONS = [IconCity, IconRoad, IconRepeat]
const DEFAULT_TONES: TariffTone[] = ['violet', 'mint', 'amber']

function toneClass(tone?: TariffTone) {
  if (tone === 'mint') return styles.toneMint
  if (tone === 'amber') return styles.toneAmber
  return styles.toneViolet
}

const Tariffs: FC<TariffsProps> = ({ className, title, subtitle, items }) => {
  const rootClassName = classNames(styles.root, className)
  const sectionRef = useRef<HTMLElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const data = useMemo(() => (items ?? []).filter(Boolean), [items])

  const headerRef = useRef<HTMLElement | null>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const root = gridRef.current
    const header = headerRef.current
    if (!section || !root) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`))
      cards.forEach((c) => c.classList.add(styles.inView))
      return
    }

    // Анимация заголовка и подзаголовка
    if (header) {
      const titleEl = header.querySelector<HTMLElement>(`.${styles.title}`)
      const subtitleEl = header.querySelector<HTMLElement>(`.${styles.subtitle}`)
      const stamp = header.querySelector<HTMLElement>(`.${styles.stamp}`)

      gsap.set([titleEl, subtitleEl, stamp], { opacity: 0, y: 30, filter: 'blur(8px)' })

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true
        }
      })

      headerTl
        .to(titleEl, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out'
        })
        .to([subtitleEl, stamp], {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.4')
    }

    // Анимация карточек
    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`))
    if (!cards.length) return

    // Устанавливаем начальные состояния
    cards.forEach((card) => {
      const icon = card.querySelector<HTMLElement>(`.${styles.icon}`)
      const badge = card.querySelector<HTMLElement>(`.${styles.badge}`)
      const titleEl = card.querySelector<HTMLElement>(`.${styles.cardTitle}`)
      const text = card.querySelector<HTMLElement>(`.${styles.cardText}`)
      const note = card.querySelector<HTMLElement>(`.${styles.note}`)

      gsap.set(card, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        filter: 'blur(8px)',
        force3D: true
      })

      gsap.set([icon, badge], {
        opacity: 0,
        scale: 0.6,
        rotation: -15,
        force3D: true
      })

      gsap.set([titleEl, text, note], {
        opacity: 0,
        y: 20,
        force3D: true
      })
    })

    // Создаем timeline с pin эффектом
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${cards.length * 400}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    // Анимируем карточки последовательно во время скролла
    cards.forEach((card, index) => {
      const icon = card.querySelector<HTMLElement>(`.${styles.icon}`)
      const badge = card.querySelector<HTMLElement>(`.${styles.badge}`)
      const titleEl = card.querySelector<HTMLElement>(`.${styles.cardTitle}`)
      const text = card.querySelector<HTMLElement>(`.${styles.cardText}`)
      const note = card.querySelector<HTMLElement>(`.${styles.note}`)

      const progress = index / cards.length

      pinTl
        .to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power2.out',
          onStart: () => card.classList.add(styles.inView)
        }, progress)
        .to([icon, badge], {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(1.4)'
        }, progress + 0.1)
        .to(titleEl, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, progress + 0.15)
        .to(text, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, progress + 0.2)
        .to(note, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        }, progress + 0.25)
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === root || st.trigger === header) {
          st.kill()
        }
      })
    }
  }, { scope: sectionRef, dependencies: [data.length] })

  return (
    <section className={rootClassName} aria-label={title} ref={sectionRef}>
      <header className={styles.head} ref={headerRef}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.stamp}>
            <IconStamp />
            как считаем
          </div>
        </div>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      <div className={styles.grid} ref={gridRef}>
        {data.map((it, idx) => {
          const Icon = ICONS[idx] ?? IconCity
          const tone = it.tone ?? DEFAULT_TONES[idx % DEFAULT_TONES.length]

          return (
            <article className={classNames(styles.card, toneClass(tone))} key={idx}>
              <div className={styles.cardTop}>
                <div className={styles.icon} aria-hidden="true">
                  <Icon />
                </div>

                <div className={styles.badge}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  тариф
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{it.title}</h3>
                <p className={styles.cardText}>{it.description}</p>

                {it.note ? (
                  <div className={styles.note}>
                    <span className={styles.noteKey}>примечание</span>
                    <span>{it.note}</span>
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Tariffs
