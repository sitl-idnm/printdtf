import { FC } from 'react'
import classNames from 'classnames'

import styles from './production.module.scss'
import { ProductionProps } from './production.types'

const Production: FC<ProductionProps> = ({
  className,
  title,
  titleArr,
  videoSrc
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <div className={styles.title}>
        <h2 className={styles.title_name}>
          {title}
        </h2>
        <ul className={styles.title_list}>
          {
            titleArr.map((item, index) => (
              <li key={index} className={styles.title_list_item}>{item.name}</li>
            ))
          }
        </ul>
      </div>
      <div>
        <video width="100vw" height="100vh" controls preload="none">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default Production
