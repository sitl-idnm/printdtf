import { FC, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import Image from 'next/image'

import styles from './caseModal.module.scss'
import { Portal } from '@/service/portal'
import { ButtonWave } from '@/ui/buttonWave'

export type CaseModalProps = {
  open: boolean
  onClose: () => void
  item?: {
    id: string | number
    kicker?: string
    type?: string
    title?: string
    image?: string
    meta?: string
    stats?: Array<{ value: string, note: string }>
  } | null
}

const CaseModal: FC<CaseModalProps> = ({ open, onClose, item }) => {

  // block body scroll and close on ESC
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, open])

  const parsedStats = useMemo(() => {
    if (item?.stats?.length) return item.stats
    const src = item?.meta ?? ''
    const res: Array<{ value: string, note: string }> = []
    const meters = src.match(/(\d+)\s*м(?!ин)/i)
    const pieces = src.match(/(\d+)\s*шт/i)
    const sets = src.match(/(\d+)\s*набор/i)
    const days = src.match(/(\d+)\s*(?:дн|сут)/i)
    if (pieces) res.push({ value: pieces[1], note: 'изделий' })
    if (meters) res.push({ value: `${meters[1]}м`, note: 'метров печати' })
    if (sets) res.push({ value: sets[1], note: 'наборов' })
    if (days) res.push({ value: days[1], note: 'дней' })
    // ensure exactly three slots
    while (res.length < 3) res.push({ value: '—', note: '' })
    return res.slice(0, 3)
  }, [item])

  if (!open) return null

  const formatType = (t?: string) => {
    if (!t) return ''
    return `//${t.toLowerCase().replace(/\s+/g, '-')}`
  }

  return (
    <Portal selector="#modal-root">
      <div className={styles.overlay} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={onClose} aria-label="Close">
          {/* двойная стрелка вверх вплотную */}
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: -8 }}>
            <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.wrap}>
          <div className={styles.impact}>{formatType(item?.type) || '//'}</div>
          <h2 className={styles.title}>
            {item?.title ?? 'CASE TITLE'}
          </h2>
          <div className={styles.desc}>
            {item?.meta ?? ''}
          </div>
          <div className={classNames(styles.hero)}>
            <Image
              src={item?.image ?? '/images/banner.jpg'}
              alt=""
              width={1600}
              height={900}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              priority
            />
          </div>
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
          <ButtonWave variant="accent3" className={styles.ticket}>Смотреть больше</ButtonWave>
        </div>
      </div>
    </Portal>
  )
}

export default CaseModal
