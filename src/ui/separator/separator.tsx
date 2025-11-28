import { FC } from 'react'
import classNames from 'classnames'

import styles from './separator.module.scss'
import { SeparatorProps } from './separator.types'

const Separator: FC<SeparatorProps> = ({
  className,
  fromColor,
  toColor,
  angle = '90deg',
  height = '2px'
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div
      className={rootClassName}
      style={{
        backgroundImage: `linear-gradient(${typeof angle === 'number' ? `${angle}deg` : angle}, ${fromColor}, ${toColor})`,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    ></div>
  )
}

export default Separator
