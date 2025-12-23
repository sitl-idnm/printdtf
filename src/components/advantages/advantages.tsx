import { FC, useRef, useEffect } from 'react'
import classNames from 'classnames'

import styles from './advantages.module.scss'
import { AdvantagesProps } from './advantages.types'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Advantages: FC<AdvantagesProps> = ({
  className,
  arrAdvantages,
  title,
  classBlock,
  imageSrc1,
  imageSrc2
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.right : null
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // Kill any existing ScrollTrigger instances for this element
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    // Get all items
    const items = containerRef.current.querySelectorAll(`.${styles.item}`)

    if (items.length === 0) return

    // Calculate end based on number of items for proper pin spacing
    const itemCount = items.length
    const endValue = itemCount * 300 // 300px per item for smooth animation

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 10%',
        end: `+=${endValue}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: 1
      }
    })

    // Store ScrollTrigger reference
    scrollTriggerRef.current = tl.scrollTrigger || null

    // Animate items from right
    tl.fromTo(
      items,
      {
        x: 800,
        rotation: 15,
        opacity: 0
      },
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        stagger: 0.8,
        ease: 'power2.out',
        duration: 2.5,
      }
    )

    return () => {
      // Cleanup on unmount or dependency change
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, { scope: containerRef, dependencies: [arrAdvantages, title] })

  // Refresh ScrollTrigger after content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.refresh()
      } else {
        ScrollTrigger.refresh()
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [arrAdvantages, title])

  return (
    <div className={rootClassName} ref={containerRef}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.bg_image}>
          <Image
            width={200}
            height={200}
            quality={90}
            src={imageSrc1}
            alt=''
            className={styles.image}
          />
          <Image
            width={200}
            height={200}
            quality={90}
            src={imageSrc2}
            alt=''
            className={styles.image2}
          />
        </div>
      </div>
      <ul className={styles.list}>
        {
          arrAdvantages?.map((item, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.number}>
                {item.num}
              </p>
              <p className={styles.text}>
                {item.text}
              </p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Advantages
