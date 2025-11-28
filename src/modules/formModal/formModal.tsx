import { FC, useEffect } from 'react'
import classNames from 'classnames'

import styles from './formModal.module.scss'
import { FormModalProps } from './formModal.types'
import { Portal } from '@/service/portal'
import Form from '@/components/form/form'
import Image from 'next/image'

const FormModal: FC<FormModalProps> = ({ className, open, onClose, title, text, imageSrc, imageAlt }) => {
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

  if (!open) return null

  const rootClassName = classNames(styles.overlay, className)

  return (
    <Portal selector="#modal-root">
      <div className={rootClassName} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: -8 }}>
            <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.wrap}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {text ? <p className={styles.desc}>{text}</p> : null}
          <div className={styles.formBox}>
            <Form submitLabel="Отправить заявку" theme="invert" />
          </div>
        </div>
        <div className={styles.footer}>
          <Image
            src={imageSrc ?? '/images/banner.jpg'}
            alt={imageAlt ?? ''}
            width={2400}
            height={120}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
    </Portal>
  )
}

export default FormModal
