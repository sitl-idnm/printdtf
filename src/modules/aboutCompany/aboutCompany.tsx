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

function IconScissors() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88" />
      <path d="M14.47 14.48L20 20" />
      <path d="M8.12 8.12L12 12" />
    </svg>
  )
}

const bulletIcons = [IconTruck, IconPrint, IconScissors]

const AboutCompany: FC<AboutCompanyProps> = ({
  className,
  title = <>О&nbsp;нас</>,
  subtitle = <>От семейной мастерской — к технологичному холдингу полного цикла</>,
  history = <>Наша история — это история роста. С октября 2015 года, начав как небольшая семейная мастерская, мы за 10+ лет прошли путь до технологичного игрока, объединяющего ключевые компетенции для вашего бизнеса.</>,
  directionsTitle = <>Три сильных направления — одна команда</>,
  directionsDescription = <>Мы создали экосистему, в которой три независимых экспертных направления. Каждое решает свои задачи на высоком уровне, а их сочетание образует идеально отлаженный производственно-логистический цикл.</>,
  principlesTitle = <>Нас выбирают за бескомпромиссный баланс трех принципов:</>,
  principles = [
    <>Скорость, отточенная процессами.</>,
    <>Качество, подтвержденное десятками тысяч изделий.</>,
    <>Клиентоориентированность — персональный менеджер и поддержка на каждом этапе.</>,
  ],
  equipment = <>Мы постоянно инвестируем в современное оборудование, чтобы предлагать клиентам передовые методы печати и пошива.</>,
  cta = <>Готовы стать следующими в нашем списке успешных проектов? Мы создаем решения, которые работают на рост вашего бизнеса.</>,
  bullets = [
    <>Современный фулфилмент для маркетплейсов. Хранение, маркировка, обработка заказов и доставка.</>,
    <>Цифровая печать (DTF/УФ) на одежде, текстиле и сувенирах. Яркость, стойкость и скорость для вашего мерча.</>,
    <>Швейное производство полного цикла. От кроя до пошива, создание продукции с нуля.</>,
  ],
  stats = [
    { value: '10', label: 'лет стабильной работы на рынке' },
    { value: '3', label: 'ключевых направления в структуре холдинга' },
    { value: '1000+', label: 'довольных клиентов и партнеров' },
    { value: '1.5 млн', label: 'изделий отшито на нашем производстве' },
    { value: '2.5 тыс. км', label: 'плёнки отпечатано — это расстояние от Москвы до Парижа!' },
    { value: '650+ тыс.', label: 'готовых переносов нанесено на продукцию' },
    { value: '7+ млн', label: 'изделий успешно замаркировано и отправлено на маркетплейсы' },
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

            {subtitle && (
              <h3 className={styles.subtitle}>{subtitle}</h3>
            )}

            {history && (
              <p className={styles.paragraph}>{history}</p>
            )}

            {directionsTitle && (
              <h3 className={styles.sectionTitle}>{directionsTitle}</h3>
            )}

            {directionsDescription && (
              <p className={styles.paragraph}>{directionsDescription}</p>
            )}

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

            {principlesTitle && (
              <h3 className={styles.sectionTitle}>{principlesTitle}</h3>
            )}

            {principles && principles.length > 0 && (
              <ul className={styles.principles}>
                {principles.map((principle, i) => (
                  <li key={i} className={styles.principle}>{principle}</li>
                ))}
              </ul>
            )}

            {equipment && (
              <p className={styles.paragraph}>{equipment}</p>
            )}

            {cta && (
              <p className={styles.cta}>{cta}</p>
            )}

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
            <div className={styles.statsTitle}>Наша экспертиза в цифрах</div>
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
