'use client'
import { FC, useRef, useState } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

import styles from './beforeAfter.module.scss'
import { BeforeAfterProps } from './beforeAfter.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const BeforeAfter: FC<BeforeAfterProps> = ({ className, title, items }) => {
  const rootClassName = classNames(styles.root, className)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [sliderPositions, setSliderPositions] = useState<Record<number, number>>({})

  // Дефолтные тестовые данные для демонстрации
  const defaultItems = [
    {
      beforeImage: '/images/1.png',
      afterImage: '/images/2.png',
      beforeLabel: 'До',
      afterLabel: 'После',
      title: 'Пример работы',
      description: 'Демонстрация функционала слайдера "До и После"'
    }
  ]

  const data = items && items.length > 0 ? items : defaultItems

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

    cards.forEach((card) => {
      const slider = card.querySelector<HTMLElement>(`.${styles.slider}`)
      const handle = card.querySelector<HTMLElement>(`.${styles.handle}`)
      const beforeImage = card.querySelector<HTMLElement>(`.${styles.beforeImage}`)
      const afterImage = card.querySelector<HTMLElement>(`.${styles.afterImage}`)

      gsap.set(card, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        filter: 'blur(8px)',
        force3D: true
      })

      gsap.set([slider, handle], {
        opacity: 0,
        scale: 0.8,
        force3D: true
      })

      gsap.set([beforeImage, afterImage], {
        opacity: 0,
        scale: 1.1,
        force3D: true
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true
      }
    })

    cards.forEach((card, index) => {
      const slider = card.querySelector<HTMLElement>(`.${styles.slider}`)
      const handle = card.querySelector<HTMLElement>(`.${styles.handle}`)
      const beforeImage = card.querySelector<HTMLElement>(`.${styles.beforeImage}`)
      const afterImage = card.querySelector<HTMLElement>(`.${styles.afterImage}`)

      const delay = index * 0.15

      tl.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        onStart: () => card.classList.add(styles.inView)
      }, delay)
        .to([beforeImage, afterImage], {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, delay + 0.2)
        .to([slider, handle], {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.4)'
        }, delay + 0.4)
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === root) {
          st.kill()
        }
      })
    }
  }, { scope: gridRef, dependencies: [data.length] })

  const handleSliderMove = (index: number, clientX: number, containerElement: HTMLElement) => {
    const rect = containerElement.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPositions((prev) => ({ ...prev, [index]: percentage }))
  }

  const handleMouseDown = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const container = e.currentTarget.closest(`.${styles.imageContainer}`) as HTMLElement
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      handleSliderMove(index, e.clientX, container)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    handleSliderMove(index, e.clientX, container)
  }

  const handleTouchStart = (index: number, e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const container = e.currentTarget.closest(`.${styles.imageContainer}`) as HTMLElement
    if (!container) return

    const touch = e.touches[0]
    if (!touch) return

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        handleSliderMove(index, touch.clientX, container)
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    handleSliderMove(index, touch.clientX, container)
  }

  const handleContainerClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(`.${styles.slider}`)) {
      return
    }

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPositions((prev) => ({ ...prev, [index]: percentage }))
  }

  return (
    <section className={rootClassName} aria-label={title || 'До и после'}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.grid} ref={gridRef}>
        {data.map((item, index) => {
          const position = sliderPositions[index] ?? 50

          return (
            <article key={index} className={styles.card}>
              <div
                className={styles.imageContainer}
                onClick={(e) => handleContainerClick(index, e)}
              >
                <div
                  className={styles.beforeImage}
                  style={{ opacity: 1, transform: 'scale(1)' }}
                >
                  {item.beforeImage && (
                    <Image
                      src={item.beforeImage}
                      alt={item.beforeLabel || 'До'}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className={styles.label} data-label="before">
                    {item.beforeLabel || 'До'}
                  </div>
                </div>
                <div
                  className={styles.afterImage}
                  style={{
                    clipPath: `inset(0 ${100 - position}% 0 0)`,
                    opacity: 1,
                    transform: 'scale(1)'
                  }}
                >
                  {item.afterImage && (
                    <Image
                      src={item.afterImage}
                      alt={item.afterLabel || 'После'}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className={styles.label} data-label="after">
                    {item.afterLabel || 'После'}
                  </div>
                </div>
                <div
                  className={styles.slider}
                  style={{ left: `${position}%` }}
                  onMouseDown={(e) => handleMouseDown(index, e)}
                  onTouchStart={(e) => handleTouchStart(index, e)}
                >
                  <div className={styles.handle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 5v14M16 5v14" />
                    </svg>
                  </div>
                  <div className={styles.line} />
                </div>
              </div>
              {item.title && (
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {item.description && (
                    <p className={styles.cardDescription}>{item.description}</p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default BeforeAfter
