'use client'
import { FC, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import styles from './arrowUp.module.scss'
import { ArrowUpProps } from './arrowUp.types'

const ArrowUp: FC<ArrowUpProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0
      setVisible(y > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      type="button"
      className={classNames(rootClassName, { [styles.visible]: visible })}
      onClick={scrollToTop}
      aria-label="Наверх"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export default ArrowUp
