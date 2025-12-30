'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './production.module.scss'
import { ProductionProps } from './production.types'

gsap.registerPlugin(ScrollTrigger)

const Production: FC<ProductionProps> = ({
  className,
  title,
  titleArr,
  videoSrcs
}) => {
  const rootClassName = classNames(styles.root, className)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (containerRef.current) {
      const videos = containerRef.current.querySelectorAll(`.${styles.video}`)

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 10%',
          end: '+=200%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        }
      })
        .fromTo(videos,
          {
            y: 100,
            opacity: 0,
            scale: 0.8
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.5,
            ease: 'power2.out',
            duration: 1
          }
        )
    }
  }, { scope: containerRef, dependencies: [videoSrcs] })

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
        {videoSrcs.map((src, index) => (
          <video
            key={index}
            className={styles.video}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  )
}

export default Production
