'use client'

import { FC, useMemo, useRef, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scheduleScrollTriggerRefresh } from '@/shared/lib/scrollTrigger'
import { Printitem } from '@/components'
import Image from 'next/image'

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
    const middleCount = Math.min(total, Math.ceil(total / 3) + 1)
    const remaining = total - middleCount
    const topCount = Math.min(Math.ceil(remaining / 2), middleCount - 1)
    const bottomCount = remaining - topCount
    const topRow = items.slice(0, topCount)
    const middleRow = items.slice(topCount, topCount + middleCount)
    const bottomRow = items.slice(topCount + middleCount, topCount + middleCount + bottomCount)
    return { topRow, middleRow, bottomRow }
  }, [items])

  const makeIcon = useMemo(() => {
    // rounded, smooth stroke icons (lucide-like)
    const common = { stroke: 'currentColor', strokeWidth: 2, fill: 'none' as const }
    const rounded = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
    const icons = {
      shirt: () => (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path {...common} {...rounded} d="M8 4l4 2 4-2 3 3-3 3v10H8V10L5 7l3-3z" />
        </svg>
      ),
      cap: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M3 15h14l4 2-1 2-7-1H5a4 4 0 0 1 8-6" /></svg>
      ),
      mug: () => (
        <svg viewBox="0 0 24 24"><rect {...common} x="3" y="7" width="12" height="10" rx="2" /><path {...common} {...rounded} d="M15 9h3a2 2 0 1 1 0 4h-3" /></svg>
      ),
      bottle: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M10 2h4v3l1 2v12a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V7l1-2V2z" /></svg>
      ),
      bag: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M6 9h12l1 10H5L6 9z" /><path {...common} {...rounded} d="M9 9V7a3 3 0 0 1 6 0v2" /></svg>
      ),
      sticker: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M7 4h7l5 5v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" /><path {...common} {...rounded} d="M14 4v5h5" /></svg>
      ),
      box: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M3 7l9-4 9 4-9 4-9-4z" /><path {...common} {...rounded} d="M3 10l9 4 9-4v7l-9 4-9-4v-7z" /></svg>
      ),
      cube: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M12 3l8 4v10l-8 4-8-4V7l8-4z" /><path {...common} {...rounded} d="M12 7l8 4M12 7L4 11" /></svg>
      ),
      sign: () => (
        <svg viewBox="0 0 24 24"><rect {...common} x="3" y="4" width="18" height="8" rx="1" /><path {...common} {...rounded} d="M9 12v8M15 12v6" /></svg>
      ),
      device: () => (
        <svg viewBox="0 0 24 24"><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} {...rounded} d="M12 17h0.01" /></svg>
      ),
      gift: () => (
        <svg viewBox="0 0 24 24"><rect {...common} x="3" y="10" width="18" height="10" rx="2" /><path {...common} {...rounded} d="M12 10v10M3 7h7v3H3zM14 7h7v3h-7z" /></svg>
      ),
      ribbon: () => (
        <svg viewBox="0 0 24 24"><circle {...common} cx="12" cy="9" r="3.5" /><path {...common} {...rounded} d="M9 12l-3 8 6-3 6 3-3-8" /></svg>
      ),
      shield: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M12 3l7 3v6a9 9 0 0 1-7 8 9 9 0 0 1-7-8V6l7-3z" /></svg>
      ),
      poster: () => (
        <svg viewBox="0 0 24 24"><rect {...common} x="4" y="4" width="16" height="12" rx="2" /><path {...common} {...rounded} d="M7 14l3-3 3 2 2-3 2 4" /></svg>
      ),
      tag: () => (
        <svg viewBox="0 0 24 24"><path {...common} {...rounded} d="M3 12l9-9 9 9-9 9-9-9z" /><circle {...common} cx="12" cy="8" r="1.5" /></svg>
      )
    }

    const pickCategory = (label: string) => {
      const t = label.toLowerCase()
      if (/(футболк|свитш|толстов|худи|одежд|форм)/.test(t)) return 'shirt'
      if (/(кепк|бейсболк)/.test(t)) return 'cap'
      if (/(кружк|чаш|керамик)/.test(t)) return 'mug'
      if (/(бутыл|фляг)/.test(t)) return 'bottle'
      if (/(сумк|шоппер)/.test(t)) return 'bag'
      if (/(стикер|накле)/.test(t)) return 'sticker'
      if (/(упаков|короб)/.test(t)) return 'box'
      if (/(пакет)/.test(t)) return 'bag'
      if (/(стекл|пластик|металл|дерев|камень)/.test(t)) return 'cube'
      if (/(вывеск|таблич)/.test(t)) return 'sign'
      if (/(гаджет|телефон|ноутбук)/.test(t)) return 'device'
      if (/(подар|сувен)/.test(t)) return 'gift'
      if (/(лента|шеврон)/.test(t)) return 'ribbon'
      if (/(кожан|бейдж)/.test(t)) return 'tag'
      if (/(постер|плакат)/.test(t)) return 'poster'
      return 'tag'
    }

    // Provide 2-3 variants per popular categories to avoid duplicates
    const variants: Record<string, Array<() => JSX.Element>> = {
      shirt: [icons.shirt, icons.ribbon],
      cap: [icons.cap, icons.tag],
      mug: [icons.mug, icons.gift],
      bottle: [icons.bottle, icons.tag],
      bag: [icons.bag, icons.box],
      sticker: [icons.sticker, icons.tag],
      box: [icons.box, icons.cube],
      cube: [icons.cube, icons.tag],
      sign: [icons.sign, icons.poster],
      device: [icons.device, icons.tag],
      gift: [icons.gift, icons.ribbon],
      ribbon: [icons.ribbon, icons.tag],
      tag: [icons.tag, icons.poster],
      poster: [icons.poster, icons.tag]
    }

    return (label: string, index: number) => {
      const cat = pickCategory(label)
      const list = variants[cat] || [icons.tag]
      const fn = list[index % list.length]
      return fn()
    }
  }, [])

  const triggerOthersFall = useCallback((anchorEl: Element) => {
    const itemsEls = rowsRef.current ? Array.from(rowsRef.current.querySelectorAll(`.${styles.item}`)) : []
    const others = itemsEls.filter(node => node !== anchorEl)
    const vh = window.innerHeight
    others.forEach((node) => {
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
    gsap.to(el, { y: 0, duration: 0.25, ease: 'power3.out' })
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
      others.forEach((node) => {
        fallTweensRef.current.get(node)?.kill()
        fallTweensRef.current.delete(node)
        gsap.to(node, {
          y: 0,
          rotation: 0,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
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

    // Avoid refresh storms (especially in Firefox) and let it batch.
    scheduleScrollTriggerRefresh()

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
                icon={makeIcon(label, idx)}
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
              icon={makeIcon(label, idx)}
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
                icon={makeIcon(label, idx)}
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
              <Image src={preparedIcons[0]} alt="" width={64} height={64} aria-hidden="true" />
            </div>
          )}
          {showTopRight && (
            <div
              className={classNames(styles.icon, styles.topRight)}
              ref={setIconRef(1)}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={() => handleMouseLeave(1)}
            >
              <Image src={preparedIcons[1]} alt="" width={64} height={64} aria-hidden="true" />
            </div>
          )}
          {showBottomLeft && (
            <div
              className={classNames(styles.icon, styles.bottomLeft)}
              ref={setIconRef(2)}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={() => handleMouseLeave(2)}
            >
              <Image src={preparedIcons[2]} alt="" width={64} height={64} aria-hidden="true" />
            </div>
          )}
          {showBottomRight && (
            <div
              className={classNames(styles.icon, styles.bottomRight)}
              ref={setIconRef(3)}
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={() => handleMouseLeave(3)}
            >
              <Image src={preparedIcons[3]} alt="" width={64} height={64} aria-hidden="true" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Printitems
