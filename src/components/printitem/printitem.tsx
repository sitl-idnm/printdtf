import { FC } from 'react'
import classNames from 'classnames'

import styles from './printitem.module.scss'
import { PrintitemProps } from './printitem.types'

const Printitem: FC<PrintitemProps> = ({
  className,
  children,
  icon,
  onMouseEnter,
  onMouseMove,
  onMouseLeave
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div
      className={rootClassName}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{children}</span>
    </div>
  )
}

export default Printitem
