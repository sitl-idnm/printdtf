'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './aboutCompany.module.scss'
import { AboutCompanyProps } from './aboutCompany.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Иконки для bullets
function IconPrint() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  )
}

function IconFileCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

const bulletIcons = [IconPrint, IconFileCheck, IconClock, IconTruck]

const AboutCompany: FC<AboutCompanyProps> = ({
  className,
  title = <>О&nbsp;компании</>,
  description = <>PrintDTF — производство и сервис под задачи бизнеса: печать, фулфилмент и логистика. Работаем быстро, прозрачно и по техническим требованиям.</>,
  bullets = [
    <>DTF и UV DTF печать — ярко, стойко, с контролем качества.</>,
    <>Подготовка/проверка макетов и понятные требования к файлам.</>,
    <>Сроки и стоимость — фиксируем до старта работ.</>,
    <>Доставка/отгрузки — под ваш график и формат (FBO/FBS).</>,
  ],
  stats = [
    { value: '1–3', label: 'дня средний срок изготовления' },
    { value: 'от 1', label: 'штуки — минимальный заказ' },
    { value: '24/7', label: 'приём заявок онлайн' },
  ],
  ctaPrimary = { label: 'Печать', href: '/print' },
  ctaSecondary = { label: 'Логистика', href: '/logistika' },
  ctaTertiary = { label: 'Фулфилмент', href: '/fullfilment' },
}) => {
  const rootClassName = classNames(styles.root, className)
  const statsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const statsContainer = statsRef.current
    if (!statsContainer) return

    const statElements = Array.from(statsContainer.querySelectorAll<HTMLElement>(`.${styles.stat}`))
    if (!statElements.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      statElements.forEach((stat) => {
        gsap.set(stat, { opacity: 1, y: 0 })
      })
      return
    }

    // Устанавливаем начальное состояние
    statElements.forEach((stat) => {
      gsap.set(stat, { opacity: 0, y: 40 })
    })

    // Создаём ScrollTrigger анимацию
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsContainer,
        start: 'top 30%',
        end: 'top bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      }
    })

    // Анимируем появление с задержкой между элементами
    tl.to(statElements, {
      opacity: 1,
      y: 0,
      duration: 2,
      stagger: 1,
      ease: 'power2.out',
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: statsRef, dependencies: [stats], revertOnUpdate: true })

  return (
    <section className={rootClassName} aria-label="О компании">
      <div className={styles.frame}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.desc}>{description}</p>

            <div className={styles.bullets}>
              {bullets.map((b, i) => {
                const Icon = bulletIcons[i] || bulletIcons[0]
                return (
                  <div key={i} className={styles.bullet}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span>{b}</span>
                  </div>
                )
              })}
            </div>

            <div className={styles.actions}>
              <Link href={ctaPrimary.href} className={classNames(styles.btn, styles.btnPrimary)}>
                {ctaPrimary.label}
              </Link>
              <Link href={ctaSecondary.href} className={classNames(styles.btn, styles.btnSecondary)}>
                {ctaSecondary.label}
              </Link>
              <Link href={ctaTertiary.href} className={classNames(styles.btn, styles.btnTertiary)}>
                {ctaTertiary.label}
              </Link>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.statsTitle}>Коротко в цифрах</div>
            <div className={styles.stats} ref={statsRef}>
              {stats.map((s, i) => (
                <div key={`${s.value}-${i}`} className={styles.stat}>
                  <div className={styles.value}>{s.value}</div>
                  <div className={styles.label}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCompany
