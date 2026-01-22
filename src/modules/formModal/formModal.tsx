import { FC, useEffect } from 'react'
import classNames from 'classnames'

import styles from './formModal.module.scss'
import { FormModalProps } from './formModal.types'
import { Portal } from '@/service/portal'
import Form from '@/components/form/form'
// import Image from 'next/image'
import { lockScroll, unlockScroll } from '@/shared/lib/scrollLock'

const FormModal: FC<FormModalProps> = ({ className,
  open,
  onClose,
  title,
  text,
  imageSrc, imageAlt,
  hidePrintMethod = false
}) => {
  const one = imageSrc
  const two = imageAlt

  console.log(one, two)

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

  if (!open) return null

  const rootClassName = classNames(styles.overlay, className)

  return (
    <Portal selector="#modal-root">
      <div className={rootClassName} role="dialog" aria-modal="true">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.wrap}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {text ? <p className={styles.desc}>{text}</p> : null}
          <div className={styles.formBox}>
            <Form submitLabel="Отправить заявку" theme="invert" hidePrintMethod={hidePrintMethod} />
          </div>
        </div>
        {/* <div className={styles.footer}>
          <Image
            src={imageSrc ?? '/images/banner.jpg'}
            alt={imageAlt ?? ''}
            width={2400}
            height={120}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div> */}
      </div>
    </Portal>
  )
}

export default FormModal
