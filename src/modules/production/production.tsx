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

      let io: IntersectionObserver | null = null
      let tlRef: gsap.core.Timeline | null = null
      let stRef: ScrollTrigger | null = null

      const createScene = () => {
        // IO
        io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLVideoElement
            if (entry.isIntersecting) {
              el.preload = 'auto'
              try { el.load() } catch { /* ignore */ }
            } else {
              try { el.pause() } catch { /* ignore */ }
            }
          })
        }, { root: null, rootMargin: '200px 0px', threshold: 0.01 })
        videos.forEach((v) => {
          const el = v as HTMLVideoElement
          el.preload = 'none'
          io?.observe(el)
        })
        // GSAP
        tlRef = gsap.timeline()
          .fromTo(videos,
            { y: 100, opacity: 0, scale: 0.8 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.5, ease: 'power2.out', duration: 1 }
          )
        stRef = ScrollTrigger.create({
          animation: tlRef,
          trigger: containerRef.current!,
          start: 'top 10%',
          end: '+=30%',
          scrub: 1,
          pin: false,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        })
      }

      const destroyScene = () => {
        try { stRef?.kill() } catch { /* ignore */ }
        try { tlRef?.kill() } catch { /* ignore */ }
        try { io?.disconnect() } catch { /* ignore */ }
        stRef = null
        tlRef = null
        io = null
      }

      createScene()

      // Handle fullscreen to avoid conflicts with pin/observers
      const onFsChange = () => {
        const fsEl = document.fullscreenElement as HTMLElement | null
        const isInside = !!fsEl && !!containerRef.current && containerRef.current.contains(fsEl)
        if (isInside) {
          // Fully tear down to avoid style updates that can exit fullscreen
          destroyScene()
          // Ensure fullscreen video is visible (no transforms/filters)
          const fsVideo = (fsEl?.tagName === 'VIDEO' ? fsEl : fsEl?.closest('video')) as HTMLVideoElement | null
          if (fsVideo) {
            try {
              // store previous inline styles to restore later
              fsVideo.dataset.prevTransform = fsVideo.style.transform || ''
              fsVideo.dataset.prevFilter = fsVideo.style.filter || ''
              fsVideo.dataset.prevOpacity = fsVideo.style.opacity || ''
              fsVideo.style.transform = 'none'
              fsVideo.style.filter = 'none'
              fsVideo.style.opacity = '1'
            } catch { /* ignore */ }
          }
        } else {
          // Recreate after exit, keep scroll position
          const y = window.scrollY
          createScene()
          // restore possible styles on previously fullscreen video
          const last = document.querySelector('video[data-prev-transform]') as HTMLVideoElement | null
          if (last) {
            try {
              last.style.transform = last.dataset.prevTransform || ''
              last.style.filter = last.dataset.prevFilter || ''
              last.style.opacity = last.dataset.prevOpacity || ''
              delete last.dataset.prevTransform
              delete last.dataset.prevFilter
              delete last.dataset.prevOpacity
            } catch { /* ignore */ }
          }
          window.scrollTo(0, y)
        }
      }

      document.addEventListener('fullscreenchange', onFsChange)
      // Safari legacy prefix (noop elsewhere) with explicit typing
      const docWithWebkit = document as Document & {
        addEventListener(type: 'webkitfullscreenchange', listener: (this: Document, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void
        removeEventListener(type: 'webkitfullscreenchange', listener: (this: Document, ev: Event) => unknown, options?: boolean | EventListenerOptions): void
      }
      docWithWebkit.addEventListener('webkitfullscreenchange', onFsChange)

      return () => {
        destroyScene()
        document.removeEventListener('fullscreenchange', onFsChange)
        docWithWebkit.removeEventListener('webkitfullscreenchange', onFsChange)
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
