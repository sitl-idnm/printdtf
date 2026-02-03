import { FC } from 'react'
import classNames from 'classnames'

import styles from './buttonWave.module.scss'
import { ButtonWaveProps } from './buttonWave.types'

const ButtonWave: FC<ButtonWaveProps> = ({
  className,
  variant = 'accent2',
  children,
  onClick,
  type = 'button',
  textColor
}) => {
  const rootClassName = classNames(
    styles.root,
    variant === 'accent2' && styles.accent2,
    variant === 'accent3' && styles.accent3,
    className
  )

  return (
    <button className={rootClassName} onClick={onClick} type={type} style={textColor ? { color: textColor } : undefined}>
      {children ?? 'Кнопка'}
    </button>
  )
}

export default ButtonWave
