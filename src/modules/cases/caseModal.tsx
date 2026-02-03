import { FC, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import { ReactNode } from 'react'

import styles from './caseModal.module.scss'
import { Portal } from '@/service/portal'
import { lockScroll, unlockScroll } from '@/shared/lib/scrollLock'
import { parseCaseStats } from '@/shared/lib/caseMeta'

export type CaseModalProps = {
  open: boolean
  onClose: () => void
  item?: {
    id: string | number
    kicker?: string
    type?: string
    title?: string
    image?: string
    images?: string[] | string
    meta?: string
    stats?: Array<{ value: string, note: string }>
    task?: string | ReactNode
    whatWeDid?: string | ReactNode
    result?: string | ReactNode
  } | null
}

const CaseModal: FC<CaseModalProps> = ({ open, onClose, item }) => {

  // block body scroll and close on ESC
  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, open])

  const parsedStats = useMemo(() => {
    const parsed = parseCaseStats(item?.meta, item?.stats)
    // map short hover notes to nice modal labels
    return parsed.map((s) => {
      if (s.note === 'шт') return { value: s.value, note: 'изделий' }
      if (s.note === 'м') return { value: s.value, note: 'метров печати' }
      if (s.note === 'день') return { value: s.value, note: 'дней' }
      if (s.note === 'сутки') return { value: s.value, note: 'суток' }
      return s
    })
  }, [item])

  if (!open) return null

  const formatType = (t?: string) => {
    if (!t) return ''
    return `//${t.toLowerCase().replace(/\s+/g, '-')}`
  }

  return (
    <Portal selector="#modal-root">
      <div className={styles.overlay} role="dialog" aria-modal="true">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.wrap}>
          <div className={styles.impact}>{formatType(item?.type) || '//'}</div>
          <h2 className={styles.title}>
            {item?.title ?? 'CASE TITLE'}
          </h2>
          <div className={styles.desc}>
            {item?.task && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Задача:</h3>
                <p>{item.task}</p>
              </div>
            )}
            {item?.whatWeDid && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Что сделали:</h3>
                <div>{item.whatWeDid}</div>
              </div>
            )}
            {item?.meta && !item?.task && !item?.whatWeDid && (
              <p>{item.meta}</p>
            )}
            {item?.result && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Результат:</h3>
                <p>{item.result}</p>
              </div>
            )}
          </div>
          <SliderHero images={item?.images} fallbackImage={item?.image} />
          <div className={styles.stats}>
            {parsedStats.map((s, i) => (
              <div key={i}>
                <div className={styles.statNum}>
                  {s.value}
                  {s.note ? <span>+</span> : null}
                </div>
                {s.note ? <div className={styles.statNote}>{s.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default CaseModal

// Internal slider for modal hero
const SliderHero: FC<{ images?: string[] | string; fallbackImage?: string }> = ({ images, fallbackImage }) => {
  const [resolvedPics, setResolvedPics] = useState<string[] | null>(null)
  const [idx, setIdx] = useState<number>(0)
  const [lastUserActionAt, setLastUserActionAt] = useState<number | null>(null)
  const [slot, setSlot] = useState<0 | 1>(0)
  const [srcA, setSrcA] = useState<string | null>(null)
  const [srcB, setSrcB] = useState<string | null>(null)

  // Resolve images: array or folder path
  useEffect(() => {
    const fallback = fallbackImage ? [fallbackImage] : ['/images/banner.jpg']
    const input = images
    // folder regex: /images/(portfolio|cases)/<slug>[/]?
    const folderFrom = (s: string): { base: 'portfolio' | 'cases'; slug: string } | null => {
      const m = s.match(/^\/images\/(portfolio|cases)\/([a-z0-9_-]+)\/?$/i)
      if (!m) return null
      return { base: (m[1] as 'portfolio' | 'cases'), slug: m[2] }
    }
    const resolve = async () => {
      try {
        if (!input) {
          setResolvedPics(fallback)
          return
        }
        if (typeof input === 'string') {
          const parsed = folderFrom(input)
          if (parsed) {
            const res = await fetch(`/api/portfolio?folder=${encodeURIComponent(parsed.slug)}&base=${parsed.base}`)
            const json = await res.json() as { files?: string[] }
            setResolvedPics((json.files && json.files.length ? json.files : fallback))
            return
          }
          setResolvedPics([input])
          return
        }
        // array case
        if (input.length === 1) {
          const parsed = folderFrom(input[0])
          if (parsed) {
            const res = await fetch(`/api/portfolio?folder=${encodeURIComponent(parsed.slug)}&base=${parsed.base}`)
            const json = await res.json() as { files?: string[] }
            setResolvedPics((json.files && json.files.length ? json.files : fallback))
            return
          }
        }
        setResolvedPics(input)
      } catch {
        setResolvedPics(fallback)
      }
    }
    resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, fallbackImage])

  // Initialize fade slots on resolve/change
  useEffect(() => {
    const pics = resolvedPics || []
    if (!pics.length) {
      setSrcA(null); setSrcB(null)
      return
    }
    const current = pics[Math.max(0, Math.min(idx, pics.length - 1))]
    if (slot === 0) {
      if (srcA !== current) setSrcA(current)
    } else {
      if (srcB !== current) setSrcB(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedPics])

  // Crossfade when idx changes
  useEffect(() => {
    const pics = resolvedPics || []
    if (!pics.length) return
    const nextSrc = pics[Math.max(0, Math.min(idx, pics.length - 1))]
    if (slot === 0) {
      // show A, prepare B with next
      if (srcA === nextSrc) return
      if (srcB !== nextSrc) setSrcB(nextSrc)
      setSlot(1)
    } else {
      // show B, prepare A with next
      if (srcB === nextSrc) return
      if (srcA !== nextSrc) setSrcA(nextSrc)
      setSlot(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  // Auto-play with user cooldown:
  // - default delay: 4000ms
  // - after any user navigation: wait until 7000ms of inactivity
  useEffect(() => {
    const pics = resolvedPics || []
    if (!pics.length || pics.length <= 1) return

    const baseDelay = 4000
    const cooldown = 7000
    let delay = baseDelay
    if (lastUserActionAt) {
      const elapsed = Date.now() - lastUserActionAt
      delay = Math.max(0, cooldown - elapsed)
    }

    const t = setTimeout(() => {
      setIdx((i: number) => (i + 1) % pics.length)
      // Reset cooldown after auto-advance so subsequent cycles use baseDelay
      setLastUserActionAt(null)
    }, delay)
    return () => clearTimeout(t)
  }, [resolvedPics, lastUserActionAt, idx])

  const prev = () => {
    setLastUserActionAt(Date.now())
    setIdx((i: number) => {
      const pics = resolvedPics || []
      if (!pics.length) return 0
      return (i - 1 + pics.length) % pics.length
    })
  }
  const next = () => {
    setLastUserActionAt(Date.now())
    setIdx((i: number) => {
      const pics = resolvedPics || []
      if (!pics.length) return 0
      return (i + 1) % pics.length
    })
  }

  return (
    <div className={classNames(styles.hero)} style={{ position: 'relative' }}>
      {/* Two-layer crossfade */}
      {srcA ? (
        /\.(mp4|webm|ogg)$/i.test(srcA) ? (
          <video
            key={`A-${srcA}`}
            className={classNames(styles.fadeLayer, slot === 0 && styles.fadeActive)}
            src={srcA}
            controls
            playsInline
            preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image
            key={`A-${srcA}`}
            src={srcA}
            alt=""
            width={1600}
            height={900}
            className={classNames(styles.fadeLayer, slot === 0 && styles.fadeActive)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )
      ) : null}
      {srcB ? (
        /\.(mp4|webm|ogg)$/i.test(srcB) ? (
          <video
            key={`B-${srcB}`}
            className={classNames(styles.fadeLayer, slot === 1 && styles.fadeActive)}
            src={srcB}
            controls
            playsInline
            preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image
            key={`B-${srcB}`}
            src={srcB}
            alt=""
            width={1600}
            height={900}
            className={classNames(styles.fadeLayer, slot === 1 && styles.fadeActive)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )
      ) : null}
      {resolvedPics && resolvedPics.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущая"
            onClick={prev}
            style={{
              position: 'absolute',
              top: '50%',
              left: '12px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              border: 0,
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Следующая"
            onClick={next}
            style={{
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              border: 0,
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
