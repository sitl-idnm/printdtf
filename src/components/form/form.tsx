import { FC } from 'react'
import classNames from 'classnames'

import styles from './form.module.scss'
import { FormProps } from './form.types'

const Form: FC<FormProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  
  return (
    <div className={rootClassName}></div>
  )
}

export default Form
