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

// Иконки для шагов работы (из Heroicons)
function IconDocumentText() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2Z" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 0-1.11.353l-1.14 1.636A1 1 0 0 0 16.5 15H15" />
      <path d="M8 8h4" />
      <path d="M9 18H7a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function IconClipboardCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function IconCube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.5 2-9 5-9-5" />
      <path d="m21.5 22-9-5-9 5" />
      <path d="m2 12 9 5 9-5" />
      <path d="m12 2v20" />
    </svg>
  )
}

function IconBuildingStorefront() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10v14" />
      <path d="M19 10v14" />
      <path d="M5 10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2" />
      <path d="M5 10h14" />
      <path d="M9 10v14" />
      <path d="M15 10v14" />
    </svg>
  )
}

function IconUserGroup() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const STEP_ICONS = [
  IconDocumentText,      // Запрос и описание товара
  IconTruck,             // Доставка товара на склад
  IconClipboardCheck,    // Приёмка и проверка
  IconCube,              // Маркировка и упаковка
  IconBuildingStorefront, // Отгрузка на склады
  IconUserGroup          // Постоянное сопровождение
]

const HowWeWork: FC<HowWeWorkProps> = ({ className, variant = 'dark', title, subtitle, steps }) => {
  const rootClassName = classNames(styles.root, variant === 'light' && styles.rootLight, className)
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
        {data.map((s, idx) => {
          const Icon = STEP_ICONS[idx] || IconDocumentText
          return (
            <article className={styles.step} key={idx}>
              <div className={styles.badge} aria-hidden="true">
                <span className={styles.iconWrapper}>
                  <Icon />
                </span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.text}>{s.text}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HowWeWork
