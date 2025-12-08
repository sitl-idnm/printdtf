import { FC } from 'react'
import classNames from 'classnames'

import styles from './whatIs.module.scss'
import { WhatIsProps } from './whatIs.types'

const WhatIs: FC<WhatIsProps> = ({
  className,
  arrWhat,
  title,
  classBlock
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.othercolor : null
  )

  return (
    <div className={rootClassName}>
      <h2 className={styles.title}>
        {title}
      </h2>
      <div className={styles.container}>
        {
          arrWhat.map((item, index) => (
            <div key={index} className={styles.list}>
              <h3 className={styles.list_title}>{item.question}</h3>
              <p className={styles.list_text}>{item.answer}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default WhatIs
