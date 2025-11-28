import { FC, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import styles from './printOptions.module.scss'
import { PrintOptionsProps } from './printOptions.types'

const PrintOptions: FC<PrintOptionsProps> = ({
  className,
  title = 'Опции выдачи:',
  left = 'Только печать: отдадим плёнку/трансферы; перенос делаете сами.',
  right = 'Печать + перенос: полностью выполним нанесение и отгрузим готовые изделия.'
}) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const decosRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const l = leftRef.current
    const r = rightRef.current
    const decos = decosRef.current
    const ctx = gsap.context(() => {
      if (l) {
        // старт ещё ближе к центру экрана
        gsap.set(l, { xPercent: -40 })
        gsap.to(l, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: l,
            start: 'top 95%',
            end: 'top 65%',
            scrub: true
          }
        })
      }
      if (r) {
        // старт ещё ближе к центру экрана
        gsap.set(r, { xPercent: 40 })
        gsap.to(r, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: r,
            start: 'top 95%',
            end: 'top 65%',
            scrub: true
          }
        })
      }

      // анимация рисования декоративных линий/крестиков
      if (decos) {
        const drawables = decos.querySelectorAll<SVGPathElement | SVGLineElement>('[data-draw="1"]')
        drawables.forEach((el) => {
          // вычислить длину линии/пути, чтобы анимация была видна на любом размере
          const len =
            // @ts-expect-error getTotalLength доступен у SVG геометрии
            typeof el.getTotalLength === 'function' ? el.getTotalLength() : 400
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(el, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: decos,
              start: 'top 60%',
              end: 'top 30%',
              scrub: true
            }
          })
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className={rootClassName} ref={rootRef}>
      <div className={styles.inner}>
        <div className={styles.decors} ref={decosRef} aria-hidden="true">
          {/* Правый верх: две диагональные палочки // (accent-2, accent-3) */}
          <svg className={styles.decSlashOne} viewBox="0 0 60 60">
            <line x1="10" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="3" data-draw="1" />
          </svg>
          <svg className={styles.decSlashTwo} viewBox="0 0 60 60">
            <line x1="5" y1="50" x2="45" y2="10" stroke="currentColor" strokeWidth="3" data-draw="1" />
          </svg>
          {/* Правый верх: плюс (accent-2) */}
          <svg className={styles.decPlus} viewBox="0 0 24 24">
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" data-draw="1" />
            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" data-draw="1" />
          </svg>
          {/* Левый низ: две горизонтальные палочки (accent-2), разной длины */}
          <svg className={styles.decBottomLong} viewBox="0 0 160 12">
            <line x1="0" y1="6" x2="160" y2="6" stroke="currentColor" strokeWidth="2" data-draw="1" />
          </svg>
          <svg className={styles.decBottomShort} viewBox="0 0 90 12">
            <line x1="0" y1="6" x2="90" y2="6" stroke="currentColor" strokeWidth="2" data-draw="1" />
          </svg>
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.col}>
          <div className={classNames(styles.badge, styles.left)} ref={leftRef}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="100%" height="100%">
                <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className={styles.text}>{left}</span>
          </div>
          <div className={classNames(styles.badge, styles.right)} ref={rightRef}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="100%" height="100%">
                <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className={styles.text}>{right}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrintOptions
