'use client'

import { FC, useMemo, useRef, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Printitem } from '@/components'

import styles from './printitems.module.scss'
import { PrintitemsProps } from './printitems.types'

const Printitems: FC<PrintitemsProps> = ({
  className,
  icons = [],
  items = ['Футболки', 'Кружки', 'Кепки', 'Свитшоты', 'Худи', 'Стикеры'],
  visibleCorners
}) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const preparedIcons = useMemo(() => {
    const result = [...icons]
    while (result.length < 4 && result.length > 0) {
      result.push(result[result.length - 1])
    }
    if (result.length === 0) {
      return []
    }
    return result.slice(0, 4)
  }, [icons])

  const iconRefs = useRef<HTMLDivElement[]>([])
  const spinTweensRef = useRef<Record<number, gsap.core.Tween | null>>({})
  const rowsRef = useRef<HTMLDivElement | null>(null)
  const bgTextRef = useRef<HTMLDivElement | null>(null)
  const getEventTarget = (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget as HTMLDivElement
  const fallTweensRef = useRef<Map<Element, gsap.core.Tween>>(new Map())
  const hoverDelayTimersRef = useRef<Map<Element, number>>(new Map())
  const fallActivatedRef = useRef<Set<Element>>(new Set())

  const setIconRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      iconRefs.current[index] = el
    }
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    const el = iconRefs.current[index]
    if (!el) return

    // Kill any deceleration tween before starting infinite spin
    spinTweensRef.current[index]?.kill()
    const spinTween = gsap.to(el, {
      rotate: '+=360',
      duration: 0.8,
      ease: 'none',
      repeat: -1
    })
    spinTweensRef.current[index] = spinTween
  }, [])

  const handleMouseLeave = useCallback((index: number) => {
    const el = iconRefs.current[index]
    if (!el) return
    // Stop infinite spin and decelerate with an ease-out rotation
    spinTweensRef.current[index]?.kill()
    spinTweensRef.current[index] = null

    const extraTurns = 0.5 + Math.random() * 1.5 // between 0.5 and 2 turns
    gsap.to(el, {
      rotate: `+=${360 * extraTurns}`,
      duration: 1.2,
      ease: 'power3.out'
    })
  }, [])

  const { topRow, middleRow, bottomRow } = useMemo(() => {
    const total = items.length
    if (total < 3) {
      return { topRow: [] as string[], middleRow: items, bottomRow: [] as string[] }
    }
    let middleCount = Math.min(total, Math.ceil(total / 3) + 1)
    let remaining = total - middleCount
    let topCount = Math.min(Math.ceil(remaining / 2), middleCount - 1)
    let bottomCount = remaining - topCount
    const topRow = items.slice(0, topCount)
    const middleRow = items.slice(topCount, topCount + middleCount)
    const bottomRow = items.slice(topCount + middleCount, topCount + middleCount + bottomCount)
    return { topRow, middleRow, bottomRow }
  }, [items])

  const triggerOthersFall = useCallback((anchorEl: Element) => {
    const itemsEls = rowsRef.current ? Array.from(rowsRef.current.querySelectorAll(`.${styles.item}`)) : []
    const others = itemsEls.filter(node => node !== anchorEl)
    const vh = window.innerHeight
    others.forEach((node, i) => {
      gsap.killTweensOf(node)
      const rect = (node as HTMLElement).getBoundingClientRect()
      const dy = Math.max(120, vh - rect.top + 180)
      const duration = 0.55 + Math.random() * 0.45
      const rot = gsap.utils.random(-25, 25)
      const tween = gsap.to(node, {
        y: `+=${dy}`,
        rotation: rot,
        duration,
        ease: 'power2.in'
      })
      fallTweensRef.current.set(node, tween)
    })
  }, [])

  const handleItemEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = getEventTarget(e)
    el.classList.add(styles.itemHover)
    gsap.set(el, { zIndex: 5 })
    gsap.to(el, { y: -8, scale: 1.06, duration: 0.25, ease: 'power3.out' })
    // delayed fall for others (200ms sustained hover)
    const existing = hoverDelayTimersRef.current.get(el)
    if (existing) window.clearTimeout(existing)
    const timerId = window.setTimeout(() => {
      triggerOthersFall(el)
      fallActivatedRef.current.add(el)
      hoverDelayTimersRef.current.delete(el)
    }, 200)
    hoverDelayTimersRef.current.set(el, timerId)
  }, [triggerOthersFall])

  const handleItemMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = getEventTarget(e)
    const rect = el.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width - 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--mx', `${((relX + 0.5) * 100).toFixed(2)}%`)
    el.style.setProperty('--my', `${((relY + 0.5) * 100).toFixed(2)}%`)
    gsap.to(el, {
      rotateY: relX * 10,
      rotateX: -relY * 10,
      duration: 0.15,
      ease: 'power2.out'
    })
  }, [])

  const handleItemLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = getEventTarget(e)
    gsap.to(el, { y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 0.25, ease: 'power2.out' })
    el.classList.remove(styles.itemHover)
    gsap.set(el, { clearProps: 'z-index' })
    // cancel pending delayed fall if not yet started
    const timer = hoverDelayTimersRef.current.get(el)
    if (timer) {
      window.clearTimeout(timer)
      hoverDelayTimersRef.current.delete(el)
    }
    // restore others
    if (fallActivatedRef.current.has(el)) {
      const itemsEls = rowsRef.current ? Array.from(rowsRef.current.querySelectorAll(`.${styles.item}`)) : []
      const others = itemsEls.filter(node => node !== el)
      others.forEach((node, i) => {
        fallTweensRef.current.get(node)?.kill()
        fallTweensRef.current.delete(node)
        gsap.to(node, {
          y: 0,
          rotation: 0,
          duration: 0.7,
          ease: 'back.out(1.6)'
        })
      })
      fallActivatedRef.current.delete(el)
    }
  }, [])

  const showTopLeft = !visibleCorners || visibleCorners.includes('topLeft')
  const showTopRight = !visibleCorners || visibleCorners.includes('topRight')
  const showBottomLeft = !visibleCorners || visibleCorners.includes('bottomLeft')
  const showBottomRight = !visibleCorners || visibleCorners.includes('bottomRight')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const sectionEl = rootRef.current
    const textEl = bgTextRef.current
    if (!sectionEl || !textEl) return

    // Phase 1: grow while верх секции идёт к верху экрана
    const grow = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const scale = 1 + 0.35 * p
        const opacity = 0.2 + 0.12 * p
        gsap.set(textEl, { scale, opacity })
      },
      invalidateOnRefresh: true
    })

    // Phase 2: shrink back after верх секции достиг верхней кромки
    const shrink = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const scale = 1.35 - 0.5 * p
        const opacity = 0.32 - 0.12 * p
        gsap.set(textEl, { scale, opacity })
      },
      invalidateOnRefresh: true
    })

    // Ensure correct measurements with SmoothSmoother
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      grow.kill()
      shrink.kill()
    }
  }, [])

  return (
    <div className={rootClassName} ref={rootRef}>
      <div className={styles.bgText} aria-hidden="true" ref={bgTextRef}>PRINT DTF &<br /> UV DTF</div>
      <div className={styles.rows} ref={rowsRef}>
        {topRow.length > 0 && (
          <div className={classNames(styles.row, styles.rowTop)}>
            {topRow.map((label, idx) => (
              <Printitem
                key={`t-${idx}`}
                className={styles.item}
                onMouseEnter={handleItemEnter}
                onMouseMove={handleItemMove}
                onMouseLeave={handleItemLeave}
              >
                {label}
              </Printitem>
            ))}
          </div>
        )}
        <div className={classNames(styles.row, styles.rowMiddle)}>
          {middleRow.map((label, idx) => (
            <Printitem
              key={`m-${idx}`}
              className={styles.item}
              onMouseEnter={handleItemEnter}
              onMouseMove={handleItemMove}
              onMouseLeave={handleItemLeave}
            >
              {label}
            </Printitem>
          ))}
        </div>
        {bottomRow.length > 0 && (
          <div className={classNames(styles.row, styles.rowBottom)}>
            {bottomRow.map((label, idx) => (
              <Printitem
                key={`b-${idx}`}
                className={styles.item}
                onMouseEnter={handleItemEnter}
                onMouseMove={handleItemMove}
                onMouseLeave={handleItemLeave}
              >
                {label}
              </Printitem>
            ))}
          </div>
        )}
      </div>
      {preparedIcons.length === 4 && (
        <>
          {showTopLeft && (
            <div
              className={classNames(styles.icon, styles.topLeft)}
              ref={setIconRef(0)}
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={() => handleMouseLeave(0)}
            >
              <img src={preparedIcons[0]} alt="" aria-hidden="true" />
            </div>
          )}
          {showTopRight && (
            <div
              className={classNames(styles.icon, styles.topRight)}
              ref={setIconRef(1)}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={() => handleMouseLeave(1)}
            >
              <img src={preparedIcons[1]} alt="" aria-hidden="true" />
            </div>
          )}
          {showBottomLeft && (
            <div
              className={classNames(styles.icon, styles.bottomLeft)}
              ref={setIconRef(2)}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={() => handleMouseLeave(2)}
            >
              <img src={preparedIcons[2]} alt="" aria-hidden="true" />
            </div>
          )}
          {showBottomRight && (
            <div
              className={classNames(styles.icon, styles.bottomRight)}
              ref={setIconRef(3)}
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={() => handleMouseLeave(3)}
            >
              <img src={preparedIcons[3]} alt="" aria-hidden="true" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Printitems
