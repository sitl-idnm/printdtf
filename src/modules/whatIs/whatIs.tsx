import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './whatIs.module.scss'
import { WhatIsProps } from './whatIs.types'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WhatIs: FC<WhatIsProps> = ({
  className,
  arrWhat,
  title,
  classBlock
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.othercolor : null
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const mmRef = useRef<gsap.MatchMedia | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // Re-init GSAP matchMedia for responsive animation
    if (mmRef.current) {
      mmRef.current.revert()
      mmRef.current = null
    }

    const rootEl = containerRef.current
    const cards = Array.from(rootEl.querySelectorAll<HTMLElement>(`.${styles.list}`))
    if (!cards.length) return

    const mm = gsap.matchMedia()
    mmRef.current = mm

    // Desktop/tablet (>= 768): pinned scrub stack animation
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top 20%',
          end: '+=1800',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true
        }
      })

      if (cards[0]) {
        tl.fromTo(cards[0], { y: 800, rotation: -10, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, ease: 'power2.out', duration: 1.2 })
      }
      if (cards[1]) {
        tl.fromTo(cards[1], { y: 800, rotation: 30, opacity: 0 }, { y: 30, rotation: -6, opacity: 1, ease: 'power2.out', duration: 1.2 }, '+=0.1')
      }
      if (cards[2]) {
        tl.fromTo(cards[2], { y: 800, rotation: -30, opacity: 0 }, { y: 30, rotation: 6, opacity: 1, ease: 'power2.out', duration: 1.2 }, '+=0.1')
      }

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })

    // Mobile (< 768): stacked deck with pin + scrub (cards overlap while section is pinned)
    mm.add('(max-width: 767px)', () => {
      const tilts = [-4, 3, -2]
      cards.forEach((card, i) => {
        const tilt = tilts[i] ?? (i % 2 === 0 ? -3 : 3)
        gsap.set(card, { willChange: 'transform, opacity', opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 160 + i * 20, rotation: tilt * 2 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top 10%',
          end: `+=${cards.length * 520}`,
          scrub: 2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      cards.forEach((card, i) => {
        const tilt = tilts[i] ?? (i % 2 === 0 ? -3 : 3)
        // Staggered "print in" + settle to tilted overlapped state
        tl.to(
          card,
          { opacity: 1, y: -i * 18, rotation: tilt, duration: 1, ease: 'power2.out' },
          i === 0 ? 0 : '+=0.25'
        )
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        cards.forEach((card) => gsap.set(card, { clearProps: 'willChange' }))
      }
    })

    return () => {
      if (mmRef.current) {
        mmRef.current.revert()
        mmRef.current = null
      }
    }
  }, { scope: containerRef, dependencies: [arrWhat, title] })

  return (
    <div className={rootClassName} ref={containerRef}>
      <h2 className={styles.title}>
        {title}
      </h2>
      <div className={styles.container}>
        {
          arrWhat.map((item, index) => (
            <div key={index} className={styles.list}>
              <h3 className={styles.list_title}>{item.question}</h3>
              <p className={styles.list_text}>{item.answer}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default WhatIs
