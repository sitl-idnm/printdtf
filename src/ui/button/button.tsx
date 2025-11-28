import Link from 'next/link'
import type { ComponentProps } from 'react'
import classNames from 'classnames'

import styles from './button.module.scss'
import { ButtonProps } from './button.types'

export default function Button ({
  colorScheme = 'black',
  size = 'md',
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const elClassName = classNames(
    styles.root,
    styles[`root_${size}`],
    styles[`root_${colorScheme}`],
    className
  )

  if (href) {
    return (
      <Link {...(props as ComponentProps<typeof Link>)} href={href} className={elClassName}>
        <div className={styles.left}>
          <div className={styles.clip_intro}>
            <div className={styles.button_banner}>
              <div className={styles.button_text}>{children}</div>
            </div>
            <div className={`${styles.button_banner} ${styles.is_bottom}`}>
              <div className={styles.button_text_color}>{children}</div>
            </div>
          </div>
          <div className={styles.button_cover}></div>
        </div>
        {children}
      </Link>
    )
  }

  return (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={elClassName}>
      <div className={styles.left}>
        <div className={styles.clip_intro}>
          <div className={styles.button_banner}>
            <div className={styles.button_text}>{children}</div>
          </div>
          <div className={`${styles.button_banner} ${styles.is_bottom}`}>
            <div className={styles.button_text_color}>{children}</div>
          </div>
        </div>
        <div className={styles.button_cover}></div>
      </div>
      {children}
    </button>
  )
}
