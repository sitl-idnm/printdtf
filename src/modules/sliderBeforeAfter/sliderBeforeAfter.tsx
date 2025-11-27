'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './sliderBeforeAfter.module.scss'
import { SliderBeforeAfterProps } from './sliderBeforeAfter.types'

const SliderBeforeAfter: FC<SliderBeforeAfterProps> = ({
  className,
  // before,
  // after,
  // beforeLabel = 'Before',
  // afterLabel = 'After',
  // initial = 0.5,
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <div className={styles.navigation}>
        <div className={styles.navigation_container}>
          <button>
            1
          </button>
          <button>
            2
          </button>
        </div>
      </div>
      <div className={styles.slider}>
        <div className={styles.first}>
          <h1>test</h1>
        </div>
        <div className={styles.second}>
          <h1>test2</h1>
        </div>
      </div>
    </div>
  )
}

export default SliderBeforeAfter
