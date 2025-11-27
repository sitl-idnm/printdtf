import Link from 'next/link'
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
}: ButtonProps<E>) {
  const elClassName = classNames(
    styles.root,
    styles[`root_${size}`],
    styles[`root_${colorScheme}`],
    className
  )

  return (
    <Link {...props} href={href} className={elClassName}>
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
