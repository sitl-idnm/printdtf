import { FC } from 'react'
import classNames from 'classnames'

import styles from './tabsButtons.module.scss'
import { TabsButtonsProps } from './tabsButtons.types'

const TabsButtons: FC<TabsButtonsProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <button className={styles.button}>
        <div>
          dtf
        </div>
      </button>
      <button className={styles.button}>
        <div>
          uv-dtf
        </div>
      </button>
    </div>
  )
}

export default TabsButtons
