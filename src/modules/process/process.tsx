'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './process.module.scss'
import { ProcessProps } from './process.types'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scheduleScrollTriggerRefresh } from '@/shared/lib/scrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Process: FC<ProcessProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  const containerRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)
  const thirdRef = useRef<HTMLDivElement>(null)
  const path12Ref = useRef<SVGPathElement>(null)
  const path23Ref = useRef<SVGPathElement>(null)

  useGSAP(() => {
    const container = containerRef.current
    const first = firstRef.current
    const second = secondRef.current
    const third = thirdRef.current
    const path12 = path12Ref.current
    const path23 = path23Ref.current
    if (!container || !first || !second || !third || !path12 || !path23) return

    const computeOrthogonalPath = (fromEl: HTMLElement, toEl: HTMLElement, yOffset = 0) => {
      const cRect = container.getBoundingClientRect()
      const from = fromEl.getBoundingClientRect()
      const to = toEl.getBoundingClientRect()
      const startX = from.left - cRect.left + from.width
      const startY = from.top - cRect.top + from.height / 2 + yOffset
      const endX = to.left - cRect.left
      const endY = to.top - cRect.top + to.height / 2 + yOffset
      const midX = (startX + endX) / 2
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`
    }

    const initPaths = () => {
      const d12 = computeOrthogonalPath(first, second, -2)
      const d23 = computeOrthogonalPath(second, third, 5)
      path12.setAttribute('d', d12)
      path23.setAttribute('d', d23)
      const len12 = path12.getTotalLength()
      const len23 = path23.getTotalLength()
      return { len12, len23 }
    }

    const { len12, len23 } = initPaths()

    // Initial states
    gsap.set([first, second, third], { opacity: 0, y: 10 })
    gsap.set(path12, { strokeDasharray: len12, strokeDashoffset: len12 })
    gsap.set(path23, { strokeDasharray: len23, strokeDashoffset: len23 })

    const tl = gsap.timeline({ paused: true })
    tl.to(first, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(path12, { strokeDashoffset: 0, duration: 2.5, ease: 'power1.inOut' })
      .to(second, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(path23, { strokeDashoffset: 0, duration: 2.5, ease: 'power1.inOut' })
      .to(third, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top 50%',
      once: true,
      onEnter: () => tl.play()
    })

    const handleResize = () => {
      const { len12: l12, len23: l23 } = initPaths()
      if (tl.progress() < 1) {
        gsap.set(path12, { strokeDasharray: l12, strokeDashoffset: l12 })
        gsap.set(path23, { strokeDasharray: l23, strokeDashoffset: l23 })
      } else {
        gsap.set(path12, { strokeDasharray: l12, strokeDashoffset: 0 })
        gsap.set(path23, { strokeDasharray: l23, strokeDashoffset: 0 })
      }
      scheduleScrollTriggerRefresh()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      tl.kill()
      st.kill()
    }
  }, { scope: containerRef })

  return (
    <div className={rootClassName}>
      <h2 className={styles.title}>
        Процесс
      </h2>
      <div className={styles.container} ref={containerRef} style={{ position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <path ref={path12Ref} fill="none" stroke="var(--color-accent-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={path23Ref} fill="none" stroke="var(--color-accent-2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className={`${styles.first} ${styles.card}`} ref={firstRef}>
          <p className={styles.text}>
            Бриф/согласование макета<br />
            Тестовый образец
          </p>
          <p className={styles.number}>
            1
          </p>
        </div>
        <div className={`${styles.second} ${styles.card}`} ref={secondRef}>
          <p className={styles.text}>
            Печать
          </p>
          <p className={styles.number}>
            2
          </p>
        </div>
        <div className={`${styles.third} ${styles.card}`} ref={thirdRef}>
          <p className={styles.text}>
            Перенос, контроль качества, доставка/самовывоз
          </p>
          <p className={styles.number}>
            3
          </p>
        </div>
      </div>
    </div>
  )
}

export default Process
