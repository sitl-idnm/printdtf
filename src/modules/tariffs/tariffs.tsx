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
  const gridRef = useRef<HTMLDivElement | null>(null)

  const data = useMemo(() => (items ?? []).filter(Boolean), [items])

  useGSAP(() => {
    const root = gridRef.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.card}`))
    if (!cards.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      cards.forEach((c) => c.classList.add(styles.inView))
      return
    }

    gsap.set(cards, { opacity: 0, y: 18, filter: 'blur(6px)' })

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

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: gridRef, dependencies: [data.length] })

  return (
    <section className={rootClassName} aria-label={title}>
      <header className={styles.head}>
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
