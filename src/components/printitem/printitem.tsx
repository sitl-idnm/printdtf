import { FC } from 'react'
import classNames from 'classnames'

import styles from './printitem.module.scss'
import { PrintitemProps } from './printitem.types'

const Printitem: FC<PrintitemProps> = ({
  className,
  children,
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
      {children}
    </div>
  )
}

export default Printitem
