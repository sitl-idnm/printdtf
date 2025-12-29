'use client'
import { FC, Children, isValidElement, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './printHero.module.scss'
import { PrintHeroProps } from './printHero.types'
import { ButtonWave } from '@/ui'
// import { Button } from '@/ui'
import Clock from '@icons/watch.svg';

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PrintHero: FC<PrintHeroProps> = ({
  className,
  title,
  subtitle,
  cta1,
  cta2,
  microtext,
  option,
  optionIcon,
}) => {
  const rootClassName = classNames(styles.root, className)
  const containerRef = useRef<HTMLDivElement>(null)

  const toLines = (node?: React.ReactNode): React.ReactNode[] => {
    if (!node) return []
    // Normalize into array of children lines
    // If it's a valid element with multiple children (like fragment with spans) – flatten
    if (isValidElement(node) && node.props && node.props.children) {
      return Children.toArray(node.props.children)
    }
    return Children.toArray(node)
  }

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    // Используем data-атрибут для поиска элементов
    const animateItems = Array.from(container.querySelectorAll<HTMLElement>('[data-animate-item]'))

    if (!animateItems.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced) {
      animateItems.forEach((el) => {
        el.classList.add(styles.inView)
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        el.style.filter = 'blur(0px)'
      })
      return
    }

    // Устанавливаем начальное состояние через GSAP
    gsap.set(animateItems, {
      opacity: 0,
      y: 30,
      filter: 'blur(8px)',
      force3D: true,
      immediateRender: true
    })

    // Создаем timeline для последовательной анимации
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.8
      },
      onStart: () => {
        // Добавляем класс сразу при старте анимации
        animateItems.forEach((el) => {
          el.classList.add(styles.inView)
        })
      }
    })

    // Анимируем все элементы последовательно
    tl.to(animateItems, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.12,
      immediateRender: false
    })

    return () => {
      tl.kill()
    }
  }, { scope: containerRef, dependencies: [title, subtitle, cta1, cta2, microtext, option] })

  return (
    <div className={rootClassName} data-chat-scheme="contrast">
      <div className={styles.spacer}>
        <div className={styles.spacer_desktop}></div>
        <div className={styles.spacer_tablet}></div>
        <div className={styles.spacer_mobile}></div>
      </div>
      <div className={styles.bg_image}></div>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.glassContainer}>
          <div className={styles.title}>
            <div className={styles.lines}>
              {toLines(title).map((line, idx) => (
                <div
                  data-animate-item
                  className={`${styles.row} ${styles.animateItem}`}
                  key={`title-${idx}`}
                >
                  <h1 className={styles.title_text}>{line}</h1>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.description_text}>
              <div className={styles.lines}>
                {subtitle && (
                  <div
                    data-animate-item
                    className={`${styles.row} ${styles.animateItem}`}
                  >
                    <p className={styles.subtitle}>{subtitle}</p>
                  </div>
                )}
                {(cta1 || cta2) && (
                  <div
                    data-animate-item
                    className={`${styles.buttons} ${styles.animateItem}`}
                  >
                    {cta1 && (
                      <ButtonWave variant="accent3" className={styles.btn} onClick={() => { if (typeof window !== 'undefined') window.location.href = '#' }}>
                        {cta1}
                      </ButtonWave>
                    )}
                    {cta2 && (
                      <ButtonWave variant="accent2" className={styles.btn} onClick={() => { if (typeof window !== 'undefined') window.location.href = '#'  }}>
                        {cta2}
                      </ButtonWave>
                    )}
                  </div>
                )}
                {microtext && (
                  <div
                    data-animate-item
                    className={`${styles.row} ${styles.animateItem}`}
                  >
                    <p className={styles.microtext}>{microtext}</p>
                  </div>
                )}
                {option && (
                  <div
                    data-animate-item
                    className={`${styles.row} ${styles.containertext} ${styles.animateItem}`}
                  >
                    <p className={styles.option}>
                      {optionIcon ? (
                        <span className={styles.clockIcon}>{optionIcon}</span>
                      ) : (
                        <Clock className={styles.clockIcon} />
                      )}
                      {option}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintHero
