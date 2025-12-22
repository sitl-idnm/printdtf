import { FC, useRef, useEffect } from 'react'
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

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // Kill any existing ScrollTrigger instances for this element
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    // Get cards by their position (matching Result.tsx pattern)
    const cardsFirst = containerRef.current.querySelectorAll(`.${styles.list}:first-child`)
    const cardsSecond = containerRef.current.querySelectorAll(`.${styles.list}:nth-child(2)`)
    const cardsThird = containerRef.current.querySelectorAll(`.${styles.list}:last-child`)

    if (cardsFirst.length === 0 && cardsSecond.length === 0 && cardsThird.length === 0) return

    // Create timeline with ScrollTrigger (matching Result.tsx)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 10% center',
        end: 'bottom',
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        refreshPriority: 1
      }
    })

    // Store ScrollTrigger reference
    scrollTriggerRef.current = tl.scrollTrigger || null

    // Animate first card (like cardRegular in Result.tsx)
    if (cardsFirst.length > 0) {
      tl.fromTo(
        cardsFirst,
        {
          y: 800,
          rotation: -10,
          opacity: 0
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          stagger: 0.9,
          ease: 'power2.out',
          duration: 2
        }
      )
    }

    // Animate second card (like cardOrange in Result.tsx)
    if (cardsSecond.length > 0) {
      tl.fromTo(
        cardsSecond,
        {
          y: 800,
          rotation: 40,
          opacity: 0
        },
        {
          y: 30,
          rotation: -10,
          opacity: 1,
          stagger: 0.9,
          ease: 'power2.out',
          duration: 2
        }
      )
    }

    // Animate third card (like cardWhite in Result.tsx)
    if (cardsThird.length > 0) {
      tl.fromTo(
        cardsThird,
        {
          y: 800,
          rotation: -40,
          opacity: 0
        },
        {
          y: 30,
          rotation: 10,
          opacity: 1,
          stagger: 0.9,
          ease: 'power2.out',
          duration: 2
        }
      )
    }

    return () => {
      // Cleanup on unmount or dependency change
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, { scope: containerRef, dependencies: [arrWhat, title] })

  // Refresh ScrollTrigger after content changes
  useEffect(() => {
    // Delay to ensure DOM has updated and fade animation completed
    const timer = setTimeout(() => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.refresh()
      } else {
        // If ScrollTrigger not created yet, refresh all
        ScrollTrigger.refresh()
      }
    }, 400) // Wait for fade animation (300ms) + buffer

    return () => clearTimeout(timer)
  }, [arrWhat, title])

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
