'use client'
import { FC, useRef, useEffect } from 'react'
import classNames from 'classnames'

import styles from './production.module.scss'
import { ProductionProps } from './production.types'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Production: FC<ProductionProps> = ({
  className,
  title,
  titleArr,
  videoSrc
}) => {
  const rootClassName = classNames(styles.root, className)

  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!videoRef.current || !containerRef.current) return

    // Save scroll position before any changes
    const scrollY = window.scrollY || window.pageYOffset

    // Kill any existing ScrollTrigger instances for this element
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 2,
        start: 'top 150%',
        end: 'bottom 100%',
        invalidateOnRefresh: true,
        refreshPriority: 1
      }
    })

    // Store ScrollTrigger reference
    scrollTriggerRef.current = tl.scrollTrigger || null

    tl.fromTo(videoRef.current, {
      scale: 0.01
    }, {
      scale: 1
    })

    // Restore scroll position after ScrollTrigger creation
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })

    return () => {
      // Cleanup on unmount or dependency change
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, { scope: containerRef, dependencies: [videoSrc, title] })

  // Refresh ScrollTrigger after content changes (only if needed)
  useEffect(() => {
    // Don't refresh if ScrollTrigger was just created in useGSAP
    // It will handle its own refresh
    if (!scrollTriggerRef.current) return

    const timer = setTimeout(() => {
      // Save current scroll position
      const scrollY = window.scrollY || window.pageYOffset

      // Use update instead of refresh for smoother experience
      ScrollTrigger.update()

      // Restore scroll position after update to prevent jump
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [videoSrc, title])

  return (
    <div className={rootClassName} ref={containerRef}>
      <div className={styles.title}>
        <h2 className={styles.title_name}>
          {title}
        </h2>
        <ul className={styles.title_list}>
          {
            titleArr.map((item, index) => (
              <li key={index} className={styles.title_list_item}>{item.name}</li>
            ))
          }
        </ul>
      </div>
      <div className={styles.container}>
        <video className={styles.video} width="100vw" height="100vh" preload="auto" ref={videoRef} autoPlay loop>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default Production
