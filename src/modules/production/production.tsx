'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './production.module.scss'
import { ProductionProps } from './production.types'

const Production: FC<ProductionProps> = ({
  className,
  title,
  titleArr,
  videoSrcs
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
      <div className={styles.container}>
        {videoSrcs.map((src, index) => (
          <video
            key={index}
            className={styles.video}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  )
}

export default Production
