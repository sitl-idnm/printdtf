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

      if (videos.length === 0) return

      // Lazy loading for videos: defer load until near viewport
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            // Switch to auto preload and trigger load
            el.preload = 'auto'
            try { el.load() } catch { /* ignore */ }
          } else {
            // Pause when out of view to save CPU/battery
            try { el.pause() } catch { /* ignore */ }
          }
        })
      }, { root: null, rootMargin: '200px 0px', threshold: 0.01 })

      videos.forEach((v) => {
        const el = v as HTMLVideoElement
        el.preload = 'none'
        io.observe(el)
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 10%',
          end: '+=200%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          refreshPriority: 1,
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

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        io.disconnect()
      }
    }
  }, { scope: containerRef, dependencies: [videoSrcs, title, titleArr], revertOnUpdate: true })

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
        {videoSrcs.map((sources, index) => (
          <video
            key={index}
            className={styles.video}
            preload="auto"
            loop
            playsInline
            controls
            aria-label="Видео процесса производства"
          >
            {/* Expect order: [1080p, 720p, 480p] */}
            {Array.isArray(sources) ? (
              <>
                {sources[2] ? <source src={sources[2]} type="video/mp4" media="(max-width: 640px)" /> : null}
                {sources[1] ? <source src={sources[1]} type="video/mp4" media="(max-width: 1280px)" /> : null}
                {sources[0] ? <source src={sources[0]} type="video/mp4" /> : null}
              </>
            ) : (
              <source src={String(sources)} type="video/mp4" />
            )}
            Ваш браузер не поддерживает видео.
          </video>
        ))}
      </div>
    </div>
  )
}

export default Production
